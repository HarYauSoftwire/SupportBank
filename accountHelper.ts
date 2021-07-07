import { getLogger } from "log4js";
import { Account, Transaction } from "./models";
import { formatter } from "./moneyHelper";

const logger = getLogger('log');

const accounts: Map<string, Account> = new Map();

export function processTransactions(transactions: Transaction[]) : void {
    logger.info('Processing transactions');
    transactions.forEach(transaction => processTransaction(transaction));
}

function processTransaction(transaction: Transaction) {
    const senderKey = transaction.sender.toLowerCase();
    let senderAccount: Account = accounts.get(senderKey) || new Account(transaction.sender);
    if (!accounts.has(senderKey)) {
        accounts.set(senderKey, senderAccount);
    }
    senderAccount.balance -= transaction.amountPence;

    const recKey = transaction.recipient.toLowerCase();
    let recAccount: Account = accounts.get(recKey) || new Account(transaction.recipient);
    if (!accounts.has(recKey)) {
        accounts.set(recKey, recAccount);
    }
    recAccount.balance += transaction.amountPence;
}

export function listAccounts(): void {
    logger.info("Listing accounts");
    accounts.forEach(account => {
        console.log(account.name + '\t' +
            formatter.format(account.balance / 100));
    });
}

export function listTransactionsFromName(requestedName: string, transactions: Transaction[]) {
    const requestedAccount = accounts.get(requestedName);
    if (!requestedAccount) {
        logger.error(`Account with requested name "${requestedName}" was not found.`);
    }
    else {
        logger.info(`Listing transactions of account ${requestedName}`);
        listTransactions(requestedAccount, transactions);
    }
}

function listTransactions(account: Account, transactions: Transaction[]): void {
    transactions.forEach(transaction => {
        if (transaction.sender == account.name) {
            console.log(transaction.date.toISODate() + '\t' +
                'To\t' +
                transaction.recipient + '\t' +
                formatter.format(transaction.amountPence / 100) + '\t' +
                transaction.narrative);
        }
        else if (transaction.recipient == account.name) {
            console.log(transaction.date.toISODate() + '\t' +
                'From\t' +
                transaction.sender + '\t' +
                formatter.format(transaction.amountPence / 100) + '\t' +
                transaction.narrative);
        }
    })
}
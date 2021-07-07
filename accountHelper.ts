import { getLogger } from "log4js";
import { Account, Transaction } from "./models";

const logger = getLogger('log');

export function processTransactions(transactions: Transaction[], accounts: Map<string, Account>) : void {
    logger.info('Processing transactions');
    transactions.forEach(transaction => processTransaction(transaction, accounts));
}

function processTransaction(transaction: Transaction, accounts: Map<string, Account>) {
    const senderKey = transaction.sender.toLowerCase();
    let senderAccount: Account = accounts.get(senderKey) || new Account(transaction.sender);
    if (!accounts.has(senderKey)) {
        accounts.set(senderKey, senderAccount);
    }
    senderAccount.balance -= transaction.amount;

    const recKey = transaction.recipient.toLowerCase();
    let recAccount: Account = accounts.get(recKey) || new Account(transaction.recipient);
    if (!accounts.has(recKey)) {
        accounts.set(recKey, recAccount);
    }
    recAccount.balance += transaction.amount;
}
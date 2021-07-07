import { configure, getLogger } from "log4js";
import { Account, Transaction } from "./models";
import readline from 'readline';
import { readTransactionsFromCsv } from "./csvHelper";
import { processTransactions } from "./accountHelper";

configure({
    appenders: {
        file: {type: 'fileSync', filename: 'logs/debug.log' },
        out: { type: 'stdout' },
        info: { type: 'logLevelFilter', appender: 'out', level: 'info' }
    },
    categories: {
        default: { appenders: ['file', 'info'], level: 'debug' }
    }
});
const logger = getLogger('log');

const accounts: Map<string, Account> = new Map();

function listAccounts(): void {
    accounts.forEach(account => {
        console.log(`${account.name}\t £${account.balance / 100}`);
    });
}

function listTransactions(account: Account): void {
    transactions.forEach(transaction => {
        if (transaction.sender == account.name) {
            console.log(`${transaction.date.toISODate()}\tTo\t${transaction.recipient}\t£${transaction.amount / 100}\t${transaction.narrative}`);
        }
        else if (transaction.recipient == account.name) {
            console.log(`${transaction.date.toISODate()}\tFrom\t${transaction.sender}\t£${transaction.amount / 100}\t${transaction.narrative}`);
        }
    })
}

function processQuery(query: string) {
    if (query == 'list all') {
        listAccounts();
    }
    else if (query.startsWith("list ")) {
        const requestedName: string = query.slice(5);
        const requestedAccount = accounts.get(requestedName);
        if (!requestedAccount) {
            logger.error(`Account with requested name "${requestedName}" was not found.`);
        }
        else {
            listTransactions(requestedAccount);
        }
    }
    else {
        logger.error(`Unknown command "${query}"`);
    }
}

/* user command */
const transactions: Transaction[] = readTransactionsFromCsv('data/DodgyTransactions2015.csv');
processTransactions(transactions, accounts);
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
rl.question("Please input a query...\n", query => {
    processQuery(query.toLowerCase());
    logger.info("Exiting program");
    rl.close();
})

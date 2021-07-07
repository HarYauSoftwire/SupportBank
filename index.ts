import { DateTime } from "luxon";

import { configure, getLogger } from "log4js";
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

class Account {
    name: string;
    balance: number = 0;

    constructor(name: string) {
        this.name = name;
    }
}

class Transaction {
    sender: string;
    recipient: string;
    narrative: string;
    date: DateTime;
    amount: number;

    constructor(sender: string, recipient: string, narrative: string, date: string, amount: number) {
        this.sender = sender;
        this.recipient = recipient;
        this.narrative = narrative;
        this.date = DateTime.fromFormat(date, 'dd/LL/yyyy');
        this.amount = amount;
    }
}

const accounts: Map<string, Account> = new Map();

function processRecord(record: string) : Transaction {
    let fields: string[] = record.split(',');
    logger.debug(`Number of fields in record is ${fields.length}`);
    logger.debug(`Date string is ${fields[0]}`);
    logger.debug(`Amount is ${fields[4]}`);
    let transaction: Transaction = new Transaction(fields[1], fields[2], fields[3], fields[0], Number(fields[4]) * 100);

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

    return transaction;
}

function processRecords(records: string[]) : Transaction[] {
    return records.map(record => processRecord(record));
}

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

function readTransactionsFromFile(filename: string): Transaction[] {
    const fs = require('fs');
    logger.info('Reading transactions file');
    const records: string[] = fs.readFileSync(filename)
        .toString()
        .split('\n')
        .slice(1, -1);
    logger.info('Processing transactions');
    return processRecords(records);
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
const transactions: Transaction[] = readTransactionsFromFile('data/DodgyTransactions2015.csv');
logger.info('Processed transactions.')
import readline from 'readline';
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
rl.question("Please input a query...\n", query => {
    processQuery(query.toLowerCase());
    logger.info("Exiting program");
    rl.close();
})

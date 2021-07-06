import { DateTime } from "luxon";

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

const accounts: Account[] = [];

function processRecord(record: string) : Transaction {
    let fields: string[] = record.split(',');
    let transaction: Transaction = new Transaction(fields[1], fields[2], fields[3], fields[0], Number(fields[4]) * 100);

    let senderAccount = accounts.find(account => account.name == transaction.sender);
    if (!senderAccount) {
        senderAccount = new Account(transaction.sender);
        accounts.push(senderAccount);
    }
    senderAccount.balance -= transaction.amount;

    let recAccount = accounts.find(account => account.name == transaction.recipient);
    if (!recAccount) {
        recAccount = new Account(transaction.recipient);
        accounts.push(recAccount);
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

/* read file */
import fs from 'fs';
const records: string[] = fs.readFileSync('data/Transactions2014.csv')
    .toString()
    .split('\n')
    .slice(1, -1);
const transactions: Transaction[] = processRecords(records);
//console.log(accounts);

/* user command */
import readline from 'readline';
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
rl.question("Please input a query...\n", query => {
    query = query.toLowerCase();
    if (query == 'list all') {
        listAccounts();
    }
    else if (query.startsWith("list ")){
        const requestedName: string = query.slice(5);
        const requestedAccount = accounts.find(account => account.name.toLowerCase() == requestedName);
        if (!requestedAccount) {
            console.log(`Account with requested name "${requestedName}" was not found.`);
        }
        else {
            listTransactions(requestedAccount);
        }
    }
    else {
        console.log("Unknown command.");
    }
    console.log("Exiting...");
    rl.close();
})
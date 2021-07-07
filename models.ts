import { DateTime } from "luxon";

export class Account {
    name: string;
    balance: number = 0;

    constructor(name: string) {
        this.name = name;
    }
}

export class Transaction {
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
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

    constructor(
        sender: string, 
        recipient: string, 
        narrative: string, 
        date: DateTime, 
        amount: number) 
    {
        this.sender = sender;
        this.recipient = recipient;
        this.narrative = narrative;
        this.date = date;
        this.amount = amount;
    }
}
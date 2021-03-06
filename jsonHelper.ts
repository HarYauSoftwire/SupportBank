import { DateTime } from "luxon";
import { Transaction } from "./models";
import { readRecords } from "./readHelper";

type TransactionJson = {
    Date: string;
    FromAccount: string;
    ToAccount: string;
    Narrative: string;
    Amount: number;
}

export function readTransactionsFromJson(fileData: string): Transaction[] {
    const records: TransactionJson[] = JSON.parse(fileData);
    return readRecords(records, readJsonRecord);
}

function readJsonRecord(record: TransactionJson, index: number) : Transaction {
    const sender: string = record.FromAccount;
    const recipient: string = record.ToAccount;
    const narrative: string = record.Narrative;
    const date: DateTime = DateTime.fromISO(record.Date);
    if (!date.isValid) {
        throw new Error(`Entry ${index + 1}: Date is not valid: ${date.invalidExplanation}`);
    }
    const amountPence: number = Math.round(record.Amount * 100);
    if (Number.isNaN(amountPence)) {
        throw new Error(`Entry ${index + 1}: "${record.Amount}" is not a valid number`);
    }
    return new Transaction(
        sender,
        recipient,
        narrative,
        date,
        amountPence
    );
}

function transactionToJson(transaction: Transaction) : TransactionJson {
    return {
        Date: transaction.date.toISO(),
        FromAccount: transaction.sender,
        ToAccount: transaction.recipient,
        Narrative: transaction.narrative,
        Amount: transaction.amountPence / 100
    }
}

export function transactionsToJsonData(records: Transaction[]) : string {
    return JSON.stringify(records.map(transactionToJson), null, '  ');
}
import { DateTime } from "luxon";
import { Transaction } from "./models";
import { readRecords } from "./readHelper";

export function readTransactionsFromCsv(fileData: string): Transaction[] {
    const records: string[] = fileData.split('\n').slice(1, -1);
    return readRecords(records, readCsvRecord);
}

function readCsvRecord(record: string, index: number) : Transaction {
    let fields: string[] = record.split(',');
    const date = DateTime.fromFormat(fields[0], 'dd/LL/yyyy');
    if (!date.isValid) {
        throw new Error(`Entry ${index + 1}: Date is not valid: ${date.invalidExplanation}`);
    }
    const amountPence = Math.round(Number(fields[4]) * 100);
    if (Number.isNaN(amountPence)) {
        throw new Error(`Entry ${index + 1}: "${fields[4]}" is not a valid number`);
    }
    return new Transaction(
        fields[1], 
        fields[2], 
        fields[3], 
        date, 
        amountPence);
}
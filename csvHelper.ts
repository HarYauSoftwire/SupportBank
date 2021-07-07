import { getLogger } from "log4js";
import { DateTime } from "luxon";
import { logError } from "./errorHelper";
import { Transaction } from "./models";

const logger = getLogger('log');

export function readTransactionsFromCsv(fileData: string): Transaction[] {
    const records: string[] = fileData.split('\n').slice(1, -1);
    return readCsvRecords(records);
}

function readCsvRecords(records: string[]) : Transaction[] {
    const transactions: Transaction[] = [];
    records.forEach((record, index) => {
        logger.debug(`Processing record ${index + 1}`);
        try {
            const transaction: Transaction = readCsvRecord(record, index);
            transactions.push(transaction);
        } catch (error) {
            logError(error);
        }
    });
    return transactions;
}

function readCsvRecord(record: string, index: number) : Transaction {
    let fields: string[] = record.split(',');
    logger.debug(`Number of fields in record is ${fields.length}`);
    logger.debug(`Date string is ${fields[0]}`);
    logger.debug(`Amount is ${fields[4]}`);
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
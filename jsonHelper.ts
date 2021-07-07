import { getLogger } from "log4js";
import { DateTime } from "luxon";
import { logError } from "./errorHelper";
import { Transaction } from "./models";

const logger = getLogger('log');

export function readTransactionsFromJson(fileData: string): Transaction[] {
    const records: Array<object> = JSON.parse(fileData);
    return readJson(records);
}

function readJson(records: Array<object>) : Transaction[] {
    const transactions: Transaction[] = [];
    records.forEach((record, index) => {
        logger.debug(`Processing record ${index + 1}`);
        try {
            const transaction: Transaction = readJsonRecord(record, index);
            transactions.push(transaction);
        } catch (error) {
            logError(error);
        }
    });
    return transactions;
}

function readJsonRecord(record: any, index: number) : Transaction {
    const sender: string = record['FromAccount'];
    const recipient: string = record['ToAccount'];
    const narrative: string = record['Narrative'];
    const date: DateTime = DateTime.fromISO(record['Date']);
    if (!date.isValid) {
        throw new Error(`Entry ${index + 1}: Date is not valid: ${date.invalidExplanation}`);
    }
    const amountPence: number = Math.round(record['Amount'] * 100);
    if (Number.isNaN(amountPence)) {
        throw new Error(`Entry ${index + 1}: "${record['Amount']}" is not a valid number`);
    }
    return new Transaction(
        sender,
        recipient,
        narrative,
        date,
        amountPence
    );
}
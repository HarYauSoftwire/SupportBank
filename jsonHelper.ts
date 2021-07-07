import { getLogger } from "log4js";
import { DateTime } from "luxon";
import { logError } from "./errorHelper";
import { Transaction } from "./models";

const logger = getLogger('log');

export function readTransactionsFromJson(filename: string): Transaction[] {
    const fs = require('fs');
    logger.info('Reading transactions JSON file');
    const recordsString: string = fs.readFileSync(filename)
        .toString();
    const records: Array<object> = JSON.parse(recordsString);
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
        throw logError(`Entry ${index + 1}: Date is not valid: ${date.invalidExplanation}`);
    }
    const amountPence: number = record['Amount'] * 100;
    if (Number.isNaN(amountPence)) {
        throw logError(`Entry ${index + 1}: "${record['Amount']}" is not a valid number`);
    }
    return new Transaction(
        sender,
        recipient,
        narrative,
        date,
        amountPence
    );
}
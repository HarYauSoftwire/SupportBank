import { getLogger } from "log4js";
import { Transaction } from "./models";
import { readTransactionsFromCsv } from "./csvHelper";
import { readTransactionsFromJson } from "./jsonHelper";
import { readTransactionsFromXml } from "./xmlHelper";
import { logError } from "./errorHelper";

const logger = getLogger('log');

export function readTransactionsFromFile(filename: string) : Transaction[] {
    const fs = require('fs');
    logger.info('Reading transactions file');
    const fileData: string = fs.readFileSync(filename).toString();
    if (filename.endsWith(".csv")) {
        return readTransactionsFromCsv(fileData);
    }
    else if (filename.endsWith(".json")) {
        return readTransactionsFromJson(fileData);
    }
    else if (filename.endsWith(".xml")) {
        return readTransactionsFromXml(fileData);
    }
    else {
        throw new Error("Specified file does not have recognised extension");
    }
}

export function readRecords(records: any[], readRecord: (record: any, index: number) => Transaction) : Transaction[] {
    const transactions: Transaction[] = [];
    records.forEach((record, index) => {
        // logger.debug(`Processing record ${index + 1}`);
        try {
            const transaction: Transaction = readRecord(record, index);
            transactions.push(transaction);
        } catch (error) {
            logError(error);
        }
    });
    return transactions;
}
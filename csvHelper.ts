import { getLogger } from "log4js";
import { Transaction } from "./models";

const logger = getLogger('log');

export function readTransactionsFromCsv(filename: string): Transaction[] {
    const fs = require('fs');
    logger.info('Reading transactions file');
    const records: string[] = fs.readFileSync(filename)
        .toString()
        .split('\n')
        .slice(1, -1);
    return readCsvRecords(records);
}

function readCsvRecords(records: string[]) : Transaction[] {
    return records.map((record, index) => {
        logger.debug(`Processing record ${index + 1}`);
        return readCsvRecord(record);
    });
}

function readCsvRecord(record: string) : Transaction {
    let fields: string[] = record.split(',');
    logger.debug(`Number of fields in record is ${fields.length}`);
    logger.debug(`Date string is ${fields[0]}`);
    logger.debug(`Amount is ${fields[4]}`);
    return new Transaction(fields[1], fields[2], fields[3], fields[0], Number(fields[4]) * 100);
}
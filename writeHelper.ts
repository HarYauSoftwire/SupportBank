import { getLogger } from "log4js";
import { transactionsToCsvData } from "./csvHelper";
import { transactionsToJsonData } from "./jsonHelper";
import { Transaction } from "./models";
import { transactionsToXmlData } from "./xmlHelper";

const logger = getLogger('log');

export function writeTransactionsToFile(filename: string, transactions: Transaction[]) : void {
    logger.info("Writing transactions to file");
    var data: string;
    if (filename.endsWith(".csv")) {
        data = transactionsToCsvData(transactions);
    }
    else if (filename.endsWith(".json")) {
        data = transactionsToJsonData(transactions);
    }
    else if (filename.endsWith(".xml")) {
        data = transactionsToXmlData(transactions);
    }
    else {
        throw new Error("Specified filename does not have recognised extension");
    }
    const fs = require('fs');
    fs.writeFile(filename, data, 'utf8', (err: Error) => {});
}
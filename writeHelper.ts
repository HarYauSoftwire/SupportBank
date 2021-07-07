import { transactionsJsonToString } from "./jsonHelper";
import { Transaction } from "./models";

export function writeTransactionsToFile(filename: string, transactions: Transaction[]) : void {
    const fs = require('fs');
    var data: string;
    if (filename.endsWith(".json")) {
        data = transactionsJsonToString(transactions);
    }
    // else if (filename.endsWith(".json")) {
    //     return readTransactionsFromJson(fileData);
    // }
    // else if (filename.endsWith(".xml")) {
    //     return readTransactionsFromXml(fileData);
    // }
    else {
        throw new Error("Specified filename does not have recognised extension");
    }
    fs.writeFile(filename, data, 'utf8', (err: Error) => {});
}
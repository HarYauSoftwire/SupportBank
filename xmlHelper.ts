import { Transaction } from "./models";
import { xml2js } from "xml-js";
import { getLogger } from "log4js";
import { DateTime } from "luxon";
import { readRecords } from "./readHelper";

const logger = getLogger('log');

export function readTransactionsFromXml(fileData: string): Transaction[] {
    const xmlObject: any = xml2js(fileData, {compact: true});
    const records: Array<any> = xmlObject.TransactionList.SupportTransaction;
    return readRecords(records, readXmlRecord);
}

function readXmlRecord(record: any, index: number) : Transaction {
    const sender: string = record.Parties.From._text;
    const recipient: string = record.Parties.To._text;
    const narrative: string = record.Description._text;
    const noOfDaysSince1900: number = Number(record._attributes.Date);
    const date: DateTime = DateTime.fromISO('1900-01-01').plus({days: noOfDaysSince1900});
    if (!date.isValid) {
        throw new Error(`Entry ${index + 1}: Date is not valid: ${date.invalidExplanation}`);
    }
    const amountPence: number = Math.round(Number(record.Value._text) * 100);
    if (Number.isNaN(amountPence)) {
        throw new Error(`Entry ${index + 1}: "${record.Value._text}" is not a valid number`);
    }
    return new Transaction(
        sender,
        recipient,
        narrative,
        date,
        amountPence
    );
}
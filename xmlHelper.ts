import { Transaction } from "./models";
import { js2xml, xml2js } from "xml-js";
import { DateTime } from "luxon";
import { readRecords } from "./readHelper";

type TransactionXml = {
    _attributes: {Date: string};
    Description: {_text: string};
    Value: {_text: string};
    Parties: {
        From: {_text: string};
        To: {_text: string};
    };
}

export function readTransactionsFromXml(fileData: string): Transaction[] {
    const xmlObject: any = xml2js(fileData, {compact: true});
    const records: TransactionXml[] = xmlObject.TransactionList.SupportTransaction;
    return readRecords(records, readXmlRecord);
}

function readXmlRecord(record: TransactionXml, index: number) : Transaction {
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

function transactionToXml(transaction: Transaction) : TransactionXml {
    return {
        _attributes: {
            Date: transaction.date.diff(DateTime.fromISO('1900-01-01'), 'days')
                .days.toString()
        },
        Description: {_text: transaction.narrative},
        Value: {_text: (transaction.amountPence / 100).toString()},
        Parties: {
            From: {_text: transaction.sender},
            To: {_text: transaction.recipient},
        }
    }
}

export function transactionsToXmlData(records: Transaction[]) : string {
    const rootXmlObject = {
        _declaration: {
            _attributes: {
                version: '1.0',
                encoding: 'utf-8'
            }
        },
        TransactionList: {
            SupportTransaction: records.map(transactionToXml)
        }
    }
    return js2xml(rootXmlObject, {compact: true, spaces: 2});
}
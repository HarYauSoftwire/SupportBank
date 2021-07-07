import { configure, getLogger } from "log4js";
import { Transaction } from "./models";
import readline from 'readline';
import { listAccounts, listTransactionsFromName, processTransactions } from "./accountHelper";
import logError from "./errorHelper";
import { readTransactionsFromFile } from "./readHelper";
import { writeTransactionsToFile } from "./writeHelper";

configure({
    appenders: {
        file: {type: 'fileSync', filename: 'logs/debug.log' },
        out: { type: 'stdout' },
        info: { type: 'logLevelFilter', appender: 'out', level: 'info' }
    },
    categories: {
        default: { appenders: ['file', 'info'], level: 'debug' }
    }
});
const logger = getLogger('log');


function processQuery(query: string) {
    if (query == 'list all') {
        listAccounts();
    }
    else if (query.startsWith("list ")) {
        const requestedName: string = query.slice(5);
        listTransactionsFromName(requestedName, transactions);
    }
    else if (query.startsWith("import file ")) {
        const inFilename: string = query.slice("import file ".length);
        try {
            transactions = readTransactionsFromFile(inFilename);
            processTransactions(transactions);
        } catch (error) {
            logError(error);
        }
    }
    else if (query.startsWith("export file ")) {
        const outFilename: string = query.slice("import file ".length);
        try {
            writeTransactionsToFile(outFilename, transactions);
        } catch (error) {
            logError(error);
        }
    }
    else if (query == 'exit') {
        logger.info("Exiting program");
        rl.close();
        return;
    }
    else {
        logger.error(`Unknown command "${query}"`);
    }
    console.log("Please input a query...");
}

/* user command */
var transactions: Transaction[];
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
rl.on('line', query => {
    processQuery(query.toLowerCase());
});
console.log("Please input a query...");

import { configure, getLogger } from "log4js";
import { Transaction } from "./models";
import readline from 'readline';
import { readTransactionsFromCsv } from "./csvHelper";
import { listAccounts, listTransactionsFromName, processTransactions } from "./accountHelper";
import { readTransactionsFromJson } from "./jsonHelper";
import { logError } from "./errorHelper";

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

function readTransactionsFromFile(filename: string) : Transaction[] {
    if (filename.endsWith(".csv")) {
        return readTransactionsFromCsv(filename);
    }
    else if (filename.endsWith(".json")) {
        return readTransactionsFromJson(filename);
    }
    else {
        throw logError("Specified file does not have recognised extension");
    }
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

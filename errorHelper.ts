import { getLogger } from "log4js";
const logger = getLogger('log');

export function logError(message: string) : Error {
    logger.error(message);
    return new Error(message);
}
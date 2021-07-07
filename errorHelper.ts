import { getLogger } from "log4js";
const logger = getLogger('log');

export function logError(error: Error) : void {
    logger.error(error.message);
}
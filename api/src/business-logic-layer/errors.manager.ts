import { NotFoundError, InvalidEventTypeError, BaseError } from "../data-layer/errors"

/**
 * A list defining what HTTP status code each error should return
 */
export const ERROR_STATUS_CODES = {}
ERROR_STATUS_CODES[NotFoundError.name] = 404
ERROR_STATUS_CODES[InvalidEventTypeError.name] = 400
ERROR_STATUS_CODES["SequelizeValidationError"] = 400
ERROR_STATUS_CODES["ValidationError"] = 400

/**
 * Simple error manager class
 */
export class ErrorsManager {
    constructor() {}

    /**
     * Returns the status code for the specified error instance
     * @param error The error instance
     */
    getStatusCode(error: BaseError): number {
        return ERROR_STATUS_CODES[error.constructor.name] ?? 500
    }
}
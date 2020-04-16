import { NotFoundError, InvalidEventTypeError, BaseError } from "../data-layer/errors"

export const ERROR_STATUS_CODES = {}
ERROR_STATUS_CODES[NotFoundError.name] = 404
ERROR_STATUS_CODES[InvalidEventTypeError.name] = 400

export class ErrorsManager {
    constructor() {}

    getStatusCode(error: BaseError): number {
        return ERROR_STATUS_CODES[error.constructor.name] ?? 500
    }
}
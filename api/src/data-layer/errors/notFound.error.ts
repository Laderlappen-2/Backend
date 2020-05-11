import { BaseError } from "./base.error";

/**
 * Thrown when something that was looked for wasn't found
 */
export class NotFoundError extends BaseError {
    constructor(objectType: string, data?: any) {
        super(`${objectType} not found`, data)
    }
}
import { BaseError } from "./base.error";


export class NotFoundError extends BaseError {
    constructor(objectType: string, data: any) {
        super(`${objectType} not found`, data)
    }
}
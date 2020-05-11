import { BaseError } from "./base.error";
import { EventTypeEnum } from "../models";

/**
 * Thrown when an invalid event type was specified
 */
export class InvalidEventTypeError extends BaseError {
    constructor(invalidEventType: EventTypeEnum) {
        super(`Invalid event type ${EventTypeEnum[invalidEventType]} (${invalidEventType})`)
    }
}
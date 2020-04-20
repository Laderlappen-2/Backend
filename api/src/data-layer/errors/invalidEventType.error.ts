import { BaseError } from "./base.error";
import { EventTypeEnum } from "../models";

export class InvalidEventTypeError extends BaseError {
    constructor(invalidEventType: EventTypeEnum) {
        super(`Invalid event type ${EventTypeEnum[invalidEventType]} (${invalidEventType})`)
    }
}
import { PositionEvent, Event, EventTypeEnum, PositionEventType, EventType } from "../data-layer/models" 
import { FindOptions, Op } from "sequelize"
import { PaginationQuery, PaginationResult } from "./drivingSessions.manager"
import { InvalidEventTypeError } from "../data-layer/errors/invalidEventType.error"
import { BaseManager } from "./base.manager"

export class EventsManager extends BaseManager<Event> {

    constructor(cradle) {
        super(cradle, Event)
    }

    async create(options: CreateEventOptions): Promise<Event> {
        if(Object.keys(EventTypeEnum).indexOf(options.eventType.toString()) == -1) {
            throw new InvalidEventTypeError(options.eventType)
        }

        // TODO Validate options.eventData to match expected data structure based on options.eventType

        const event = await new Event({
            eventTypeId: options.eventType,
            drivingSessionId: options.drivingSessionId
        }).save()

        switch(options.eventType) {
            case EventTypeEnum.POSITION: {
                await new PositionEvent({
                    eventId: event.id,
                    positionX: options.eventData.positionX,
                    positionY: options.eventData.positionY,
                    positionZ: options.eventData.positionZ,
                    positionEventType: 1, // TODO Remove this
                }).save()
                break
            }

            default:
                break
        }

        return await Event.findOne({
            where: {
                id: event.id
            },
            include: [{ all: true }]
        })
    }

    async createPositionEvent(options: CreatePositionEventOptions) : Promise<Event> {
        const event = await new Event({
            eventTypeId: EventTypeEnum.POSITION,
            drivingSessionId: options.drivingSessionId
        }).save()
        await new PositionEvent({
            eventId: event.id,
            positionX: options.event.positionX,
            positionY: options.event.positionY,
            positionZ: options.event.positionZ,
            positionEventType: options.positionEventType,
        }).save()
        return await Event.findOne({
            where: {
                id: event.id
            },
            include: [{ all: true }]
        })
    }

}

export type CreateEventOptions = {
    eventType: EventTypeEnum
    drivingSessionId: number
    eventData: any
}

export type CreatePositionEventOptions = {
    positionEventType: PositionEventType
    drivingSessionId: number
    event: PositionEvent
}
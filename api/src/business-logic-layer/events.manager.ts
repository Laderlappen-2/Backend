import { PositionEvent, Event, EventTypeEnum, CollisionAvoidanceEvent, EventType } from "../data-layer/models" 
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
            drivingSessionId: options.drivingSessionId,
            dateCreated: options.dateCreated
        }).save()

        switch(options.eventType) {
            case EventTypeEnum.POSITION: {
                await new PositionEvent({
                    eventId: event.id,
                    positionX: options.eventData?.positionX,
                    positionY: options.eventData?.positionY,
                }).save()
                break
            }

            case EventTypeEnum.COLLISSION_AVOIDANCE: {
                await new CollisionAvoidanceEvent({
                    eventId: event.id,
                    positionX: options.eventData?.positionX,
                    positionY: options.eventData.positionY,
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

    async getEventTypes() {
        return await EventType.findAll()
    }
}

export type CreateEventOptions = {
    eventType: EventTypeEnum
    drivingSessionId: number
    dateCreated: Date
    eventData: any
}
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

    async createBatch(events: CreateEventBatchOptions): Promise<EventBatchResult> {
        // TODO: Validate options
        
        // Create base events
        let baseEvents = []
        for(const event of events.events) {
            baseEvents.push({
                eventTypeId: event.eventType,
                drivingSessionId: events.drivingSessionId,
                dateCreated: event.dateCreated
            })
        }
        const savedEvents = await Event.bulkCreate(baseEvents)

        // Create sub events
        let positionEvents = []
        let collisionAvoidanceEvents = []
        let index = 0;
        for(const event of events.events) {
            
            switch(event.eventType) {
                case EventTypeEnum.COLLISSION_AVOIDANCE: {
                    collisionAvoidanceEvents.push({
                        eventId: savedEvents[index].id,
                        positionX: event.eventData?.positionX,
                        positionY: event.eventData?.positionY,
                    })
                    break
                }

                case EventTypeEnum.POSITION: {
                    positionEvents.push({
                            eventId: savedEvents[index].id,
                            positionX: event.eventData?.positionX,
                            positionY: event.eventData?.positionY,
                        })
                    break
                }
            }

            index += 1
        }
        CollisionAvoidanceEvent.bulkCreate(collisionAvoidanceEvents)
        PositionEvent.bulkCreate(positionEvents)

        return {
            count: savedEvents.length,
            eventIds: savedEvents.map(x => x.id) 
        }
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

export type BatchEvent = {
    eventType: EventTypeEnum
    dateCreated: Date
    eventData: any
}

export type CreateEventBatchOptions = {
    drivingSessionId: number
    events: [BatchEvent]
}

export type EventBatchResult = {
    count: number
    eventIds: number[]
}
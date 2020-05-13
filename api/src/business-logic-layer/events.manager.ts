import { PositionEvent, Event, EventTypeEnum, CollisionAvoidanceEvent, EventType } from "../data-layer/models" 
import { DrivingSessionsManager } from "./drivingSessions.manager"
import { InvalidEventTypeError } from "../data-layer/errors/invalidEventType.error"
import { BaseManager } from "./base.manager"

/**
 * Business logic layer for events
 */
export class EventsManager extends BaseManager<Event> {

    /** @internal */
    private drivingSessionsManager: DrivingSessionsManager

    /** @internal */
    constructor({ drivingSessionsManager }) {
        super({ drivingSessionsManager }, Event)
        this.drivingSessionsManager = drivingSessionsManager
    }

    /**
     * Create a new event associated with a specific driving session
     * @param options
     */
    async create(options: CreateEventOptions): Promise<Event> {
        if(Object.keys(EventTypeEnum).indexOf(options.eventTypeId.toString()) == -1) {
            throw new InvalidEventTypeError(options.eventTypeId)
        }

        // TODO Validate options.eventData to match expected data structure based on options.eventType

        const event = await new Event({
            eventTypeId: options.eventTypeId,
            drivingSessionId: options.drivingSessionId,
            dateCreated: options.dateCreated
        }).save()

        switch(options.eventTypeId) {
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

    /**
     * Create multiple events associated with one driving session
     * @param events
     */
    async createBatch(events: CreateEventBatchOptions): Promise<EventBatchResult> {
        // TODO: Validate options

        // Require that the driving session exists
        await this.drivingSessionsManager.getByIdOrThrow(events.drivingSessionId)
        
        // Create base events
        let baseEvents = []
        for(const event of events.events) {
            baseEvents.push({
                eventTypeId: event.eventTypeId,
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
            
            switch(event.eventTypeId) {
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

    /**
     * Returns all event types
     * @returns An array of all event types
     */
    async getEventTypes() {
        return await EventType.findAll()
    }
}

export type CreateEventOptions = {
    eventTypeId: EventTypeEnum
    drivingSessionId: number
    dateCreated: Date
    eventData: any
}

export type BatchEvent = {
    eventTypeId: EventTypeEnum
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
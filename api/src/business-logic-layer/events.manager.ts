import { PositionEvent, Event, EventTypeEnum, PositionEventType, EventType } from "../data-layer/models" 
import { FindOptions, Op } from "sequelize"
import { PaginationQuery, PaginationResult } from "./drivingSessions.manager"
import { InvalidEventTypeError } from "../data-layer/errors/invalidEventType.error"

export class EventsManager {

    // TODO Extend generic base class, as this exact method is used on multiple places
    async getWithPagination(pagination?: PaginationQuery): Promise<PaginationResult<Event>> {
        let options: FindOptions = {}

        if(pagination) {
            // Get all IDs above the id specified in "pagination.from" (Op.gt == Greater than)
            if(pagination.from) {
                options.where = {
                    id: {
                        [Op.gte]: pagination.from
                    }
                }
            }
            options.limit = pagination.limit ?? undefined
        }


        const result = await Event.findAll(options)
        let nextResult: any = null

        if(result.length > 0) {
            // Try to get next id
            nextResult = await Event.findOne({
                where: {
                    id: {
                        // Get the id of the last row returned
                        [Op.gt]: result[result.length-1].id
                    }
                }
            })
        }

        return {
            from: pagination && pagination.from ? pagination.from : null,
            next: nextResult && nextResult.id ? nextResult.id : null,
            limit: pagination && pagination.limit ? pagination.limit : 0,
            results: result
        }
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
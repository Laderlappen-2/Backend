import { PositionEvent, Event, EventTypeEnum, PositionEventType, EventType } from "../data-layer/models" 

export class EventsManager {

    async createPositionEvent(options: CreateEventOptions) : Promise<Event> {
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
    positionEventType: PositionEventType
    drivingSessionId: number
    event: PositionEvent
}
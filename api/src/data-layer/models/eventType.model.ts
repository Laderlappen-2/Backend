import { Table, Column, Model, PrimaryKey, HasMany } from "sequelize-typescript"
import { Event } from "./event.model"

/**
 * Defines the type of an event
 */
@Table({ tableName: "eventTypes", timestamps: false })
export class EventType extends Model<EventType> {
    
    @PrimaryKey
    @Column
    id: number

    @Column({ allowNull: false })
    name: string

    @HasMany(() => Event)
    events: [Event]
}

/**
 * Default event type values
 */
const EventTypeDefaults = [
    {
        id: 1,
        name: "CONNECTED",
    },
    {
        id: 2,
        name: "DISCONNECTED",
    },
    {
        id: 3,
        name: "COLLISSION_AVOIDANCE",
    },
    {
        id: 4,
        name: "COLLISSION",
    },
    {
        id: 5,
        name: "POSITION",
    },
    {
        id: 6,
        name: "USER_INPUT",
    },
]

/** @internal */
export async function createEventTypeDefaults(): Promise<any[]> {
    const res = await EventType.bulkCreate(EventTypeDefaults, { ignoreDuplicates: true })
    console.log("Executed " + res.length + " default event types")
    return res
}

export enum EventTypeEnum {
    CONNECTED = 1,
    DISCONNECTED = 2,
    COLLISSION_AVOIDANCE = 3, // When a collission was avoided, i.e. an obstacle was detected in time and could avoid it
    COLLISSION = 4, // When a collission was not avoided, i.e. an obstacle was not detected in time and the robot hit something
    POSITION = 5,
    USER_INPUT = 6,
}
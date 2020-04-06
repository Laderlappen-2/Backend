import { Table, Column, Model, AutoIncrement, PrimaryKey, HasMany } from "sequelize-typescript"
import { Event } from "./event.model"

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

export enum EventTypeEnum {
    CONNECTED = 1,
    DISCONNECTED = 2,
    COLLISSION_AVOIDANCE = 3, // When a collission was avoided, i.e. an obstacle was detected in time and could avoid it
    COLLISSION = 4, // When a collission was not avoided, i.e. an obstacle was not detected in time and the robot hit something
    POSITION = 5,
    USER_INPUT = 6,
}
import { Table, Column, Model, AutoIncrement, PrimaryKey, HasMany } from "sequelize-typescript"
import Event from "./event.model"

@Table({ tableName: "eventTypes", timestamps: false })
export default class EventType extends Model<EventType> {
    
    @PrimaryKey
    @Column
    id: number

    @Column({ allowNull: false })
    name: string

    @HasMany(() => Event)
    events: [Event]
}
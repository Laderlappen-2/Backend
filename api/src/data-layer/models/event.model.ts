import { Table, Column, Model, AutoIncrement, PrimaryKey, ForeignKey, BelongsTo } from "sequelize-typescript"
import EventType from "./eventType.model"
import Session from "./session.model"

@Table({ tableName: "events", timestamps: false })
export default class Event extends Model<Event> {

    @AutoIncrement
    @PrimaryKey
    @Column
    id: number

    @ForeignKey(() => EventType)
    @Column({ allowNull: false })
    eventTypeId: number

    @ForeignKey(() => Session)
    @Column({ allowNull: false })
    sessionId: number
    

    @BelongsTo(() => EventType)
    eventType: EventType
    
    @BelongsTo(() => Session)
    session: Session
}

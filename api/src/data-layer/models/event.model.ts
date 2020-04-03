import { Table, Column, Model, AutoIncrement, PrimaryKey, ForeignKey, BelongsTo, DataType } from "sequelize-typescript"
import { EventType, Session } from "./"

@Table({ tableName: "events", timestamps: false })
export class Event extends Model<Event> {

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
    
    @Column({ allowNull: false, defaultValue: new Date(), type: DataType.DATE })
    dateCreated: Date

    @BelongsTo(() => EventType)
    eventType: EventType
    
    @BelongsTo(() => Session)
    session: Session
}

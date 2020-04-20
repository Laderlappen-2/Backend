import { Table, Column, Model, AutoIncrement, PrimaryKey, ForeignKey, BelongsTo, DataType, HasOne } from "sequelize-typescript"
import { EventType } from "./eventType.model"
import { DrivingSession } from "./drivingSession.model"
import { CollisionAvoidanceEvent } from "./collisionAvoidanceEvent.model"
import { PositionEvent } from "./positionEvent.model"

@Table({ tableName: "events", timestamps: false })
export class Event extends Model<Event> {

    @AutoIncrement
    @PrimaryKey
    @Column
    id: number

    @ForeignKey(() => EventType)
    @Column({ allowNull: false })
    eventTypeId: number

    @ForeignKey(() => DrivingSession)
    @Column({ allowNull: false })
    drivingSessionId: number
    
    @Column({ allowNull: false, defaultValue: new Date(), type: DataType.DATE })
    dateCreated: Date

    @BelongsTo(() => EventType)
    eventType: EventType
    
    @BelongsTo(() => DrivingSession)
    drivingSession: DrivingSession

    @HasOne(() => CollisionAvoidanceEvent)
    collisionAvoidanceEvent: CollisionAvoidanceEvent

    @HasOne(() => PositionEvent)
    positionEvent: PositionEvent
}

import { Table, Column, Model, AutoIncrement, PrimaryKey, ForeignKey, BelongsTo, DataType } from "sequelize-typescript"
import { Event } from "./event.model"
import { EventTypeEnum } from "./eventType.model"

/**
 * Contains x and y positions of where the collision avoidance was
 */
@Table({ tableName: "collisionAvoidanceEvents", timestamps: false })
export class CollisionAvoidanceEvent extends Model<CollisionAvoidanceEvent> {

    @ForeignKey(() => Event)
    @Column({ allowNull: false, onDelete: "CASCADE" })
    eventId: number

    @Column({ allowNull: false, type: DataType.FLOAT })
    positionX: number

    @Column({ allowNull: false, type: DataType.FLOAT })
    positionY: number

    @BelongsTo(() => Event)
    event: Event
}

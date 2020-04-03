import { Table, Column, Model, AutoIncrement, PrimaryKey, ForeignKey, BelongsTo, DataType } from "sequelize-typescript"
import { Event, EventTypeEnum } from "./"

@Table({ tableName: "collision_avoidance_events", timestamps: false })
export class CollisionAvoidanceEvent extends Model<CollisionAvoidanceEvent> {

    // Only events with the id of COLLISSION_AVOIDANCE events are allowed in this table
    @ForeignKey(() => Event)
    @Column({ allowNull: false, values: [ EventTypeEnum.COLLISSION_AVOIDANCE.toString() ], onDelete: "CASCADE" })
    eventId: number

    @Column({ allowNull: false, type: DataType.FLOAT })
    positionX: number

    @Column({ allowNull: false, type: DataType.FLOAT })
    positionY: number

    @Column({ allowNull: false, type: DataType.FLOAT })
    positionZ: number

    @BelongsTo(() => Event)
    event: Event
}

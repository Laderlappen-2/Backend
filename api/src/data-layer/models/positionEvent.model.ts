import { Table, Column, Model, AutoIncrement, PrimaryKey, ForeignKey, BelongsTo, DataType } from "sequelize-typescript"
import { Event, EventTypeEnum } from "./"

@Table({ tableName: "position_events", timestamps: false })
export class PositionEvent extends Model<PositionEvent> {

    // Only events with the id of POSITION events are allowed in this table
    @ForeignKey(() => Event)
    @Column({ allowNull: false, values: [ EventTypeEnum.POSITION.toString() ], onDelete: "CASCADE" })
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
import { Table, Column, Model, AutoIncrement, PrimaryKey, ForeignKey, BelongsTo, DataType } from "sequelize-typescript"
import { Event } from "./event.model"

@Table({ tableName: "positionEvents", timestamps: false })
export class PositionEvent extends Model<PositionEvent> {

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

import { Table, Column, Model, AutoIncrement, PrimaryKey, ForeignKey, BelongsTo, DataType } from "sequelize-typescript"
import { Event } from "./event.model"

export enum PositionEventType {
    POSITION = 1,
    COLLISION = 2
}

@Table({ tableName: "positionEvents", timestamps: false })
export class PositionEvent extends Model<PositionEvent> {

    @ForeignKey(() => Event)
    @Column({ allowNull: false, onDelete: "CASCADE" })
    eventId: number

    @Column({ allowNull: false, type: DataType.FLOAT })
    positionX: number

    @Column({ allowNull: false, type: DataType.FLOAT })
    positionY: number

    @Column({ allowNull: false, type: DataType.FLOAT })
    positionZ: number

    @Column({ allowNull: false, values: Object.keys(PositionEventType) })
    positionEventType: number

    @BelongsTo(() => Event)
    event: Event
}

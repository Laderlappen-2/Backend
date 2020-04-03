import { Table, Column, Model, AutoIncrement, PrimaryKey, HasMany } from "sequelize-typescript"
import { Event } from "./"

@Table({ tableName: "sessions", timestamps: false })
export class Session extends Model<Session> {

    @PrimaryKey
    @AutoIncrement
    @Column
    id: number

    @Column({ allowNull: false })
    date: Date

    @HasMany(() => Event)
    events: [Event]
}

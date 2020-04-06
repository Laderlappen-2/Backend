import { Table, Column, Model, HasMany, AutoIncrement, PrimaryKey } from "sequelize-typescript"
import { Event } from "./"

@Table({ tableName: "drivingSessions" })
export class DrivingSession extends Model<DrivingSession> {

    @AutoIncrement
    @PrimaryKey
    @Column
    id: number

    @HasMany(() => Event)
    events: [Event]
}

import { Table, Column, Model, HasMany, AutoIncrement, PrimaryKey, BelongsToMany, AfterCreate, AfterUpdate, AfterFind, AfterSave } from "sequelize-typescript"
import { Event } from "./event.model"
import { CollisionAvoidanceEvent } from "./collisionAvoidanceEvent.model"

@Table({ tableName: "drivingSessions" })
export class DrivingSession extends Model<DrivingSession> {

    @AutoIncrement
    @PrimaryKey
    @Column
    id: number

    @HasMany(() => Event)
    events: [Event]

    // @AfterCreate
    // @AfterFind
    // @AfterUpdate
    // @AfterSave
    // static async getCollisionEvents(instance: DrivingSession): Promise<Event[]> {
    //     instance.collisions = await Event.findAll({
    //         where: {
    //             drivingSessionId: instance.id
    //         },
    //         include: [CollisionAvoidanceEvent]
    //     })
    //     return instance.collisions
    // }

    collisions: Event[] = []
    // TODO Implement
    paths: any[] = []

    toJSON(): any {
        var json: any = super.toJSON()
        json.collisions = this.collisions
        json.paths = this.paths
        return json
    }
}
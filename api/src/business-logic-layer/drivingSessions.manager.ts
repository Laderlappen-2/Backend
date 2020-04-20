import { DrivingSession, Event } from "../data-layer/models" 
import { BaseManager } from "./base.manager"

export class DrivingSessionsManager extends BaseManager<DrivingSession> {
    
    constructor(cradle) {
        super(cradle, DrivingSession)
    }

    async getById(drivingSessionId: number): Promise<DrivingSession> {
        const drivingSession = await DrivingSession.findOne({
            where: {
                id: drivingSessionId
            },
            include: [{
                model: Event,
                include: [{ all: true }]
            }]
        })
        // Populate collisions with collision events
        // drivingSession.collisions = await Event.findAll({
        //     where: {
        //         drivingSessionId: drivingSessionId
        //     },
        //     include: [CollisionAvoidanceEvent]
        // })
        // // Populate paths with position events
        // drivingSession.paths = await Event.findAll({
        //     where: {
        //         drivingSessionId: drivingSessionId
        //     },
        //     include: [PositionEvent]
        // })
        return drivingSession
    }

}

export type PaginationQuery = {
    limit?: number
    from?: number
}

export type PaginationResult<T> = {
    from: any
    next: any
    limit: number
    results: T[]
}
import { DrivingSession, Event, CollisionAvoidanceEvent, PositionEvent } from "../data-layer/models" 
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
                include: [PositionEvent, CollisionAvoidanceEvent]
            }]
        })
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
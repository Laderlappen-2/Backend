import { DrivingSession, Event, CollisionAvoidanceEvent, PositionEvent } from "../data-layer/models" 
import { BaseManager } from "./base.manager"

/**
 * Business logic layer for driving sessions
 */
export class DrivingSessionsManager extends BaseManager<DrivingSession> {
    
    /** @internal */
    constructor(cradle) {
        super(cradle, DrivingSession)
    }

    /**
     * Returns a driving session including its associated events
     * @param drivingSessionId The id of the driving session that should be returned
     */
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
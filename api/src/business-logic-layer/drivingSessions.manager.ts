import { EventType, CollisionAvoidanceEvent, Event, DrivingSession } from "../data-layer/models" 

export class DrivingSessionsManager {

    async createDrivingSession() : Promise<DrivingSession> {
        return await new DrivingSession().save()
    }

}
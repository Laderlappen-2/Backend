import { DrivingSession } from "../data-layer/models" 

export class DrivingSessionsManager {

    async createDrivingSession() : Promise<DrivingSession> {
        return await DrivingSession.build().save()
    }

}
import { route, GET, POST, before } from 'awilix-express'
import { Request, Response, NextFunction } from "express"
import { DrivingSessionsManager } from '../../business-logic-layer'

@route('/drivingsessions')
export default class DrivingSessionsRoute {

    private readonly drivingSessionManager: DrivingSessionsManager
    
    constructor({ drivingSessionManager }) {
        this.drivingSessionManager = drivingSessionManager
    }

    @route('')
    @POST()
    async createDrivingSession(req: Request, res: Response, next: NextFunction) {
        try {
            const drivingSession = await this.drivingSessionManager.createDrivingSession()
            res.status(201)
                .header("Location", `${req.originalUrl}/${drivingSession.id}`)
                .json(drivingSession)
        } catch(err) {
            next(err)
        }
    }

}
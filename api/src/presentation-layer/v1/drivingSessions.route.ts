import { route, GET, POST, before } from 'awilix-express'
import { Request, Response, NextFunction } from "express"
import { DrivingSessionsManager, PaginationQuery } from '../../business-logic-layer'
import url = require("url")

@route('/drivingsessions')
export default class DrivingSessionsRoute {

    private readonly drivingSessionManager: DrivingSessionsManager
    
    constructor({ drivingSessionManager }) {
        this.drivingSessionManager = drivingSessionManager
    }

    @GET()
    async getAllDrivingSessions(req: Request, res: Response, next: NextFunction) {
        try {
            const pagination: PaginationQuery = {}
            
            if(req.query.from)
                pagination.from = parseInt(req.query.from)
            if(req.query.limit)
                pagination.limit = parseInt(req.query.limit)

            res.json(await this.drivingSessionManager.getWithPagination(pagination))
        }catch(err) {
            next(err)
        }
    }

    @route("/:id")
    @GET()
    async getDrivingSessionById(req: Request, res: Response, next: NextFunction) {
        try {
            res.json(await this.drivingSessionManager.getById(parseInt(req.params.id)))
        } catch(err) {
            next(err)
        }
    }

    @POST()
    async createDrivingSession(req: Request, res: Response, next: NextFunction) {
        try {
            const drivingSession = await this.drivingSessionManager.create()
            res.status(201)
                .header("Location", `${req.originalUrl}/${drivingSession.id}`)
                .json(drivingSession)
        } catch(err) {
            next(err)
        }
    }

}
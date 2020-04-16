import { route, GET, POST, before, DELETE } from 'awilix-express'
import { Request, Response, NextFunction } from "express"
import { DrivingSessionsManager, PaginationQuery } from '../../business-logic-layer'
import url = require("url")

@route('/drivingsessions')
export default class DrivingSessionsRoute {

    private readonly drivingSessionsManager: DrivingSessionsManager
    
    constructor({ drivingSessionManager }) {
        this.drivingSessionsManager = drivingSessionManager
    }

    @GET()
    async getAllDrivingSessions(req: Request, res: Response, next: NextFunction) {
        try {
            const pagination: PaginationQuery = {}
            
            if(req.query.from)
                pagination.from = parseInt(req.query.from)
            if(req.query.limit)
                pagination.limit = parseInt(req.query.limit)

            res.json(await this.drivingSessionsManager.getWithPagination(pagination))
        }catch(err) {
            next(err)
        }
    }

    @route("/:id")
    @GET()
    async getDrivingSessionById(req: Request, res: Response, next: NextFunction) {
        try {
            res.json(await this.drivingSessionsManager.getById(parseInt(req.params.id)))
        } catch(err) {
            next(err)
        }
    }

    @POST()
    async createDrivingSession(req: Request, res: Response, next: NextFunction) {
        try {
            const drivingSession = await this.drivingSessionsManager.create()
            res.status(201)
                .header("Location", `${req.originalUrl}/${drivingSession.id}`)
                .json(drivingSession)
        } catch(err) {
            next(err)
        }
    }

    @route("/:id")
    @DELETE()
    async deleteDrivingSession(req: Request, res: Response, next: NextFunction) {
        try {
            await this.drivingSessionsManager.delete(parseInt(req.params.id))
            res.sendStatus(204)
        } catch(err) {
            next(err)
        }
    }

}
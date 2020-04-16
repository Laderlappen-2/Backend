import { route, GET, POST, before } from 'awilix-express'
import { Request, Response, NextFunction } from "express"
import { EventsManager, PaginationQuery } from '../../business-logic-layer'

@route('/events')
export default class DrivingSessionsRoute {

    private readonly eventsManager: EventsManager
    
    constructor({ eventsManager }) {
        this.eventsManager = eventsManager
    }

    @GET()
    async getEvents(req: Request, res: Response, next: NextFunction) {
        try {
            const pagination: PaginationQuery = {}
            
            if(req.query.from)
                pagination.from = parseInt(req.query.from)
            if(req.query.limit)
                pagination.limit = parseInt(req.query.limit)

            res.json(await this.eventsManager.getWithPagination(pagination))
        } catch(err) {
            next(err)
        }
    }

    @POST()
    async createEvent(req: Request, res: Response, next: NextFunction) {
        try {
            const event = await this.eventsManager.create(req.body)
            res.status(201)
                .header("Location", `${req.originalUrl}/${event.id}`)
                .json(event)
        } catch(err) {
            next(err)
        }
    }

    @route("/position")
    @POST()
    async createPositionEvent(req: Request, res: Response, next: NextFunction) {
        try {
            const event = await this.eventsManager.createPositionEvent(req.body)
            res.status(201)
                .header("Location", `${req.originalUrl}/${event.id}`)
                .json(event)
        } catch(err) {
            next(err)
        }
    }

}
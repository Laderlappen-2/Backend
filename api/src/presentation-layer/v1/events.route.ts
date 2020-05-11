import { route, GET, POST, before } from 'awilix-express'
import { Request, Response, NextFunction } from "express"
import { EventsManager, PaginationQuery } from '../../business-logic-layer'

@route('/events')
export default class EventsRoute {

    private readonly eventsManager: EventsManager
    
    constructor({ eventsManager }) {
        this.eventsManager = eventsManager
    }

    @GET()
    async getEvents(req: Request, res: Response, next: NextFunction) {
        try {
            const pagination: PaginationQuery = {}

            if(req.query.from) {
                var from: String = new String(req.query.from)
                pagination.from = parseInt(from.toString())
            }
            if(req.query.limit) {
                pagination.limit = parseInt(limit.toString())
                var limit: String = new String(req.query.limit)
            }

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

    @route("/batch")
    @POST()
    async createMultipleEvents(req: Request, res: Response, next: NextFunction) {
        try {
            const result = await this.eventsManager.createBatch(req.body)
            res.status(201)
                .json(result)
        } catch(err) {
            next(err)
        }
    }

    @route("/types")
    @GET()
    async getAllEventTypes(req: Request, res: Response, next: NextFunction) {
        try {
            var eventTypesEnum = await this.eventsManager.getEventTypes()
            res.json(eventTypesEnum)
        }catch(err) {
            next(err)
        }
    }

}
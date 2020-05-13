import { route, GET, POST, before } from 'awilix-express'
import { Request, Response, NextFunction } from "express"
import { EventsManager, PaginationQuery } from '../../business-logic-layer'

/**
 * Class to handle /events API requests
 */
@route('/events')
export default class EventsRoute {

    /** @internal */
    private readonly eventsManager: EventsManager
    
    /** @internal */
    constructor({ eventsManager }) {
        this.eventsManager = eventsManager
    }

    /**
     * Responds with a paginated JSON object of all events
     * @param req {@link Request}
     * @param res {@link Response}
     * @param next {@link NextFunction}
     */
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

    /**
     * Responds with a JSON object of the created event
     * @param req {@link Request}
     * @param res {@link Response}
     * @param next {@link NextFunction}
     */
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

    /**
     * Responds with a JSON object of
     * @param req {@link Request}
     * @param res {@link Response}
     * @param next {@link NextFunction}
     */
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
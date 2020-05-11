import { route, GET, POST, before, DELETE } from 'awilix-express'
import { Request, Response, NextFunction } from "express"
import { DrivingSessionsManager, PaginationQuery, EventsManager, CreateEventBatchOptions } from '../../business-logic-layer'
/** @ignore */
import url = require("url")

/**
 * Class to handle /drivingsessions API requests
 */
@route('/drivingsessions')
export default class DrivingSessionsRoute {

    /** @internal */
    private readonly drivingSessionsManager: DrivingSessionsManager
    /** @internal */
    private readonly eventsManager: EventsManager
    
    /** @internal */
    constructor({ drivingSessionsManager, eventsManager }) {
        this.drivingSessionsManager = drivingSessionsManager
        this.eventsManager = eventsManager
    }

    /**
     * Responds with a paginated JSON array of all driving sessions
     * @param req {@link Request}
     * @param res {@link Response}
     * @param next {@link NextFunction}
     */
    @GET()
    async getAllDrivingSessions(req: Request, res: Response, next: NextFunction) {
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

            res.json(await this.drivingSessionsManager.getWithPagination(pagination))
        }catch(err) {
            next(err)
        }
    }

    /**
     * Respons with a JSON object of the specified driving session
     * @param req {@link Request}
     * @param res {@link Response}
     * @param next {@link NextFunction}
     */
    @route("/:id")
    @GET()
    async getDrivingSessionById(req: Request, res: Response, next: NextFunction) {
        try {
            res.json(await this.drivingSessionsManager.getById(parseInt(req.params.id)))
        } catch(err) {
            next(err)
        }
    }

    /**
     * Responds with a JSON object of the new driving session
     * @param req {@link Request}
     * @param res {@link Response}
     * @param next {@link NextFunction}
     */
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

    /**
     * Responds with an empty body and status 204 if the driving session was deleted
     * @param req {@link Request}
     * @param res {@link Response}
     * @param next {@link NextFunction}
     */
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

    /**
     * Responds with information regarding the created events
     * 
     * Example response:
     * ```json
     * {
     *    count: 2,
     *    ids: [
     *      1,
     *      2
     *    ]
     * }
     * ```
     * @param req {@link Request}
     * @param res {@link Response}
     * @param next {@link NextFunction}
     */
    @route("/:id/events")
    @POST()
    async createDrivingSessionEvents(req: Request, res: Response, next: NextFunction) {
        try {
            const createEventBatchOptions: CreateEventBatchOptions = {
                drivingSessionId: parseInt(req.params.id),
                events: req.body
            }
            
            const result = await this.eventsManager.createBatch(createEventBatchOptions)
            res.status(201)
                .json(result)
        } catch(err) {
            next(err)
        }
    }

}
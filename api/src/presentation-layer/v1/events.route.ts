import { route, GET, POST, before } from 'awilix-express'
import { Request, Response, NextFunction } from "express"
import { EventsManager } from '../../business-logic-layer'

@route('/events')
export default class DrivingSessionsRoute {

    private readonly eventsManager: EventsManager
    
    constructor({ eventsManager }) {
        this.eventsManager = eventsManager
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
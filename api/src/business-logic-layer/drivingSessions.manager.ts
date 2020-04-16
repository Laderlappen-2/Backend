import { CollisionAvoidanceEvent, DrivingSession, PositionEvent, Event } from "../data-layer/models" 
import { FindOptions, Op } from "sequelize"

export class DrivingSessionsManager {

    async getWithPagination(pagination?: PaginationQuery): Promise<PaginationResult<DrivingSession>> {
        let options: FindOptions = {}

        if(pagination) {
            // Get all IDs above the id specified in "pagination.from" (Op.gt == Greater than)
            if(pagination.from) {
                options.where = {
                    id: {
                        [Op.gte]: pagination.from
                    }
                }
            }
            options.limit = pagination.limit ?? undefined
        }


        const result = await DrivingSession.findAll(options)
        let nextResult: any = null

        if(result.length > 0) {
            // Try to get next id
            nextResult = await DrivingSession.findOne({
                where: {
                    id: {
                        // Get the id of the last row returned
                        [Op.gt]: result[result.length-1].id
                    }
                }
            })
        }

        return {
            from: pagination && pagination.from ? pagination.from : null,
            next: nextResult && nextResult.id ? nextResult.id : null,
            limit: pagination && pagination.limit ? pagination.limit : 0,
            results: result
        }
    }

    async create() : Promise<DrivingSession> {
        return await new DrivingSession().save()
    }

    async getById(drivingSessionId: number): Promise<DrivingSession> {
        const drivingSession = await DrivingSession.findOne({
            where: {
                id: drivingSessionId
            }
        })
        // Populate collisions with collision events
        drivingSession.collisions = await Event.findAll({
            where: {
                drivingSessionId: drivingSessionId
            },
            include: [CollisionAvoidanceEvent]
        })
        // Populate paths with position events
        drivingSession.paths = await Event.findAll({
            where: {
                drivingSessionId: drivingSessionId
            },
            include: [PositionEvent]
        })
        return drivingSession
    }

    async getByIdOrThrow(drivingSessionId: number): Promise<DrivingSession> {
        const drivingSession = await DrivingSession.findByPk(drivingSessionId)
        if(!drivingSession)
            // TODO Create NotFoundError("DrivingSession", { drivingSessionId: id })
            throw new Error(`Driving session with id ${drivingSessionId} was not found`)
        return drivingSession
    }

    async delete(drivingSessionId: number): Promise<void> {
        return await (await this.getByIdOrThrow(drivingSessionId)).destroy()
    }

}

export type PaginationQuery = {
    limit?: number
    from?: number
}

export type PaginationResult<T> = {
    from: any
    next: any
    limit: number
    results: T[]
}
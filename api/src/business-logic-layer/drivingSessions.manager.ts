import { EventType, CollisionAvoidanceEvent, Event, DrivingSession } from "../data-layer/models" 
import { FindOptions, Op } from "sequelize"

export class DrivingSessionsManager {

    async getDrivingSessions(pagination?: PaginationQuery): Promise<PaginationResult<DrivingSession>> {
        let options: FindOptions = {}

        if(pagination) {
            // Get all IDs above the id specified in "pagination.from" (Op.gt == Greater than)
            if(pagination.from) {
                options.where = {
                    id: {
                        [Op.gt]: pagination.from
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

    async createDrivingSession() : Promise<DrivingSession> {
        return await new DrivingSession().save()
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

export type PaginationLinks = {
    base: string
    previous?: string
    next?: string
    self: string
}
import { Model } from "sequelize-typescript";
import { FindOptions, Op } from "sequelize";
import { NotFoundError } from "../data-layer/errors";

export abstract class BaseManager<T extends Model> {
    
    protected modelClass: any
    constructor(cradle, modelClass) {    
        this.modelClass = modelClass
    }

    async getWithPagination(pagination?: PaginationQuery): Promise<PaginationResult<T>> {
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


        const result = await this.modelClass.findAll(options)
        let nextResult: any = null

        if(result.length > 0) {
            // Try to get next id
            nextResult = await this.modelClass.findOne({
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

    async create(modelData?: any): Promise<T>
    async create(modelData?: T): Promise<T> {
        return await new this.modelClass(modelData).save()
    }

    async getByIdOrThrow(primaryKey: any): Promise<T> {
        const modelInstance = await this.modelClass.findByPk(primaryKey)
        if(!modelInstance)
            throw new NotFoundError(`${this.modelClass.name} id ${primaryKey}`)
        return modelInstance
    }

    async delete(primaryKey: any): Promise<void> {
        const modelInstance = await this.getByIdOrThrow(primaryKey)
        return await modelInstance.destroy()
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
import { Model } from "sequelize-typescript";
import { FindOptions, Op } from "sequelize";
import { NotFoundError } from "../data-layer/errors";

/**
 * The base manager all managers should extend, containing generic functions.
 * @template T The model that should be used with this manager
 */
export abstract class BaseManager<T extends Model> {
    
    /** @internal */
    protected modelClass: any
    /** @internal */
    constructor(cradle, modelClass) {    
        this.modelClass = modelClass
    }

    /**
     * Paginate model data
     * 
     * Example response object:
     * ```javascript
     * {
     *     limit: 3,
     *     next: 4,
     *     results: [
     *         {
     *             id: 1
     *             some: "data"
     *         },
     *         {
     *             id: 2
     *             some: "data2"
     *         },
     *         {
     *             id: 3
     *             some: "data3"
     *         },
     *     ]
     * }
     * ```
     * @param pagination A pagination query, defining the limit and where to start
     */
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

    /**
     * Generic function to create and save a new model instance in the database
     * @param modelData The data to create the model
     */
    async create(modelData?: any): Promise<T>
    async create(modelData?: T): Promise<T> {
        return await new this.modelClass(modelData).save()
    }

    /**
     * Returns the model or throws a {@link NotFoundError}
     * @param primaryKey The primary key of the model instance that we want to find
     */
    async getByIdOrThrow(primaryKey: any): Promise<T> {
        const modelInstance = await this.modelClass.findByPk(primaryKey)
        if(!modelInstance)
            throw new NotFoundError(`${this.modelClass.name} id ${primaryKey}`)
        return modelInstance
    }

    /**
     * Deletes the model with the specified primary key
     * @param primaryKey The primary key of the model instance we want to delete
     */
    async delete(primaryKey: any): Promise<void> {
        const modelInstance = await this.getByIdOrThrow(primaryKey)
        return await modelInstance.destroy()
    }
}

/**
 * The query when paginating a model
 */
export type PaginationQuery = {
    /** Limit the number of results */
    limit?: number
    /** Specifies from what id the result should begin from */
    from?: number
}

/**
 * The object returned when paginating a model
 * @template T The model type
 */
export type PaginationResult<T> = {
    /** Specifies from what id the result begins from */
    from: any
    /** Specifies what id should be used as "from" to get the next result set */
    next: any
    /** The specified limit */
    limit: number
    /** An array of all matching model instances */
    results: T[]
}
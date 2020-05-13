/**
 * The class all errors should extend
 */
export abstract class BaseError {

    /** @internal */
    public message: string
    /** @internal */
    public data?: any

    /**
     * 
     * @param message A description of the error
     * @param data Additional data that could be needed to further describe the error
     */
    constructor(message: string, data?: any) {
        this.message = message
        this.data = data
    }
}
export class BadRequestError {
    status: number = 400
    message: string
    
    constructor(msg: string) {
        this.message = msg
    }
}
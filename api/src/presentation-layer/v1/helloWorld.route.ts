import { route, GET, POST, before } from 'awilix-express'
import { Request, Response, NextFunction } from "express"
import { HelloWorldManager } from '../../business-logic-layer'

@route('/helloworld')
export default class HelloWorldRoute {

    private readonly helloWorldManager: HelloWorldManager

    constructor({ helloWorldManager }) {
        this.helloWorldManager = helloWorldManager
    }

    @route('')
    @GET()
    async getHelloWorld(req: Request, res: Response, next: NextFunction) {
        res.send(this.helloWorldManager.getString())
    }

}
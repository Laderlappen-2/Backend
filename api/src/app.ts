import * as dotenv from "dotenv"
import express = require("express")
import { Request, Response, NextFunction } from "express"
import bodyParser = require("body-parser")
import fs = require("fs")
import { loadControllers, scopePerRequest } from 'awilix-express'
import * as managers from "./business-logic-layer"
const { asClass, asValue, createContainer} = require('awilix')
import { sequelize } from "./data-layer/database"
import { BaseError } from "./data-layer/errors/base.error"
import { NotFoundError } from "./data-layer/errors/notFound.error"
import { InvalidEventTypeError } from "./data-layer/errors/invalidEventType.error"
import { ErrorsManager } from "./business-logic-layer"

export const app = express()

// Sync database
sequelize.sync()
.then(() => {
    console.log("Database synchronized..")
    app.emit("database_ready")
})
.catch(err => {
    console.log(err, "Error synchronizing database")
})

// Setup dotenv
dotenv.config()

// Setup awilix container
const container = createContainer()
container.register({
    // Scoped lifetime = new instance per request
    // Imagine the TodosService needs a `user`.
    // class TodosService { constructor({ user }) { } }
    //userManager: asClass(managers.UserManager)
    helloWorldManager: asClass(managers.HelloWorldManager),
    drivingSessionManager: asClass(managers.DrivingSessionsManager),
    eventsManager: asClass(managers.EventsManager),
    errorsManager: asClass(managers.ErrorsManager),
})

app.use(bodyParser.json())

// Setup awilix express
app.use(scopePerRequest(container))
for(let folderName of fs.readdirSync(__dirname + "/presentation-layer")) {
    app.use(`/${folderName}`, loadControllers(`presentation-layer/${folderName}/*.route.ts`, { cwd: __dirname }))
}
app.use(loadControllers(`presentation-layer/*.route.ts`, { cwd: __dirname }))

app.use((err: BaseError, req: Request, res: Response, next: NextFunction) => {
    if(res.headersSent)
        return next(err)

    if(process.env.NODE_ENV.trim() != "test")
        console.log(err)

    const errorsManager: ErrorsManager = container.resolve("errorsManager")
    const statusCode = errorsManager.getStatusCode(err)
    const response = {
        status: statusCode,
        message: err.message,
        data: (err.data ? err.data : undefined)
    }
    res.status(statusCode).json(response)
})
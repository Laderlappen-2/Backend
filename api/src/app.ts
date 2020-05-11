// app.ts
/**
 * Application configuration
 */

import * as dotenv from "dotenv"
import { Request, Response, NextFunction } from "express"
import { asClass, createContainer } from "awilix"
import { loadControllers, scopePerRequest } from 'awilix-express'
import * as express from "express"
import * as bodyParser from "body-parser"
import * as fs from "fs"
import * as managers from "./business-logic-layer"

import { sequelize } from "./data-layer/database"
import { BaseError } from "./data-layer/errors/base.error"
import { ErrorsManager } from "./business-logic-layer"
import { createEventTypeDefaults } from "./data-layer/models"

/** The main express instance of the app */
export const app = express()

// Sync database
sequelize.sync()
.then(async () => {
    await createEventTypeDefaults()

    console.log("Database synchronized..")

    app.emit("database_ready")
})
.catch(err => {
    console.log(err, "Error synchronizing database")
})

// Setup dotenv
dotenv.config()

/** The awilix container for dependency injection */
const awilixContainer = createContainer()
awilixContainer.register({
    drivingSessionsManager: asClass(managers.DrivingSessionsManager),
    eventsManager: asClass(managers.EventsManager),
    errorsManager: asClass(managers.ErrorsManager),
})

app.use(bodyParser.json())

// Setup awilix express
app.use((req, res, next) => {
    console.log(`Received ${req.method} request to ${req.originalUrl} with body: ${JSON.stringify(req.body)}`)
    next()
})
app.use(scopePerRequest(awilixContainer))
for(let folderName of fs.readdirSync(__dirname + "/presentation-layer")) {
    app.use(`/${folderName}`, loadControllers(`presentation-layer/${folderName}/*.route.ts`, { cwd: __dirname }))
}
app.use(loadControllers(`presentation-layer/*.route.ts`, { cwd: __dirname }))

app.use((err: BaseError, req: Request, res: Response, next: NextFunction) => {
    if(res.headersSent)
        return next(err)

    if(process.env.NODE_ENV?.trim() != "test")
        console.log(err)

    const errorsManager: ErrorsManager = awilixContainer.resolve("errorsManager")
    const statusCode = errorsManager.getStatusCode(err)
    const response = {
        status: statusCode,
        message: err.message,
        data: (err.data ? err.data : undefined)
    }
    res.status(statusCode).json(response)
})
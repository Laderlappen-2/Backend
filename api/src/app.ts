import * as dotenv from "dotenv"
import express = require("express")
import bodyParser = require("body-parser")
import fs = require("fs")
import { loadControllers, scopePerRequest } from 'awilix-express'
import * as managers from "./business-logic-layer"
const { asClass, asValue, createContainer} = require('awilix')
import { sequelize } from "./data-layer/database"
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
    drivingSessionManager: asClass(managers.DrivingSessionsManager)
})

app.use(bodyParser.json())

// Setup awilix express
app.use(scopePerRequest(container))
for(let folderName of fs.readdirSync(__dirname + "/presentation-layer")) {
    app.use(`/${folderName}`, loadControllers(`presentation-layer/${folderName}/*.route.ts`, { cwd: __dirname }))
}
app.use(loadControllers(`presentation-layer/*.route.ts`, { cwd: __dirname }))
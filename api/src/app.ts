import * as dotenv from "dotenv"
import express = require("express")
import { loadControllers, scopePerRequest } from 'awilix-express'
import * as managers from "./business-logic-layer"
import { sequelize } from "./data-layer/database"
const { asClass, asValue, createContainer} = require('awilix')
export const app = express()

// Setup dotenv
dotenv.config()

// Setup awilix container
const container = createContainer()
container.register({
    // Scoped lifetime = new instance per request
    // Imagine the TodosService needs a `user`.
    // class TodosService { constructor({ user }) { } }
    //userManager: asClass(managers.UserManager)
    helloWorldManager: asClass(managers.HelloWorldManager)
})

// Setup awilix express
app.use(scopePerRequest(container))
app.use(loadControllers("presentation-layer/v1/*.route.ts", { cwd: __dirname }))
import * as dotenv from "dotenv"
import express = require("express")
import { loadControllers, scopePerRequest } from 'awilix-express'
//import * as managers from "./business-logic-layer"
import { sequelize } from "./data-layer/database"
const { asClass, asValue, createContainer} = require('awilix')
const app = express()

// Setup dotenv
dotenv.config()

const PORT = process.env.PORT || 8080

// Setup awilix container
const container = createContainer()
container.register({
    // Scoped lifetime = new instance per request
    // Imagine the TodosService needs a `user`.
    // class TodosService { constructor({ user }) { } }
    //userManager: asClass(managers.UserManager)
})

// Sync database
sequelize.sync()
    .then(() => {
        console.log("Database synchronized, starting server..")
        startServer(PORT)
    })
    .catch(err => {
        console.log(err, "Error synchronizing database")
    })

// Setup awilix express
app.use(scopePerRequest(container))
app.use("/v1", loadControllers("presentation-layer/v1/*.js", { cwd: __dirname } ))

function startServer(port: any) {
    app.listen(port, () => {
        console.log("REST API up and running on port " + port)
    })
}


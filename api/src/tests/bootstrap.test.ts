import { app } from "../app"
import { before } from "mocha"

before((done) => {
    app.on("database_ready", done)
})
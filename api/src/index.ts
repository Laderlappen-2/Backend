// index.ts
/**
 * Listens for "database_ready" event from application configuration, then starts the server.
 */

import { app } from "./app"

/** @internal */
const PORT = process.env.PORT || 8080

/**
 * Starts the server on the specified port
 * @param port The port the server should listen on
 */
function startServer(port: any) {
    app.listen(port, () => {
        console.log("REST API up and running on port " + port)
        app.emit("server_started")
    })
}

app.on("database_ready", () => {
    startServer(PORT)
})
import { app } from "./app"

const PORT = process.env.PORT || 8080

function startServer(port: any) {
    app.listen(port, () => {
        console.log("REST API up and running on port " + port)
        app.emit("server_started")
    })
}

app.on("database_ready", () => {
    startServer(PORT)
})
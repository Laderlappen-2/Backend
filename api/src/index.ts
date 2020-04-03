import { sequelize } from "./data-layer/database"
import { app } from "./app"

const PORT = process.env.PORT || 8080

// Sync database
sequelize.sync()
    .then(() => {
        console.log("Database synchronized, starting server..")
        startServer(PORT)
    })
    .catch(err => {
        console.log(err, "Error synchronizing database")
    })

function startServer(port: any) {
    app.listen(port, () => {
        console.log("REST API up and running on port " + port)
        app.emit("server_started")
    })
}
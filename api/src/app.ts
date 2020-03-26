const express = require("express")
const app = express()

app.listen(process.env.PORT || 8080, () => {
    console.log("REST API up and running on port " + (process.env.PORT || 8080))
})

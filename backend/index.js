const express = require('express');
const PORT = process.env.REACT_APP_PORT || 8000;
var cors = require('cors')
var app = express()
require("./db.js")
 


app.use(cors())
app.use(express.json())

app.get("/",(req,res) => {
    res.send("hi")
})
//avaliable routess
app.use("/api/auth",require("./routes/auth"))
app.use("/api/notes",require("./routes/notes"))

app.listen(PORT, () => {
    console.log(`server is running at the port no ${PORT}`)
})
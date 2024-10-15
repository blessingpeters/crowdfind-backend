const express = require("express")
const bodyParser = require("body-parser")
const mongoose = require("mongoose")
const eventRouter = require("./routes/events.route")


const port = 3000
const app = express()

app.use(express.json());
app.use("/event", eventRouter);

app.get("/", function(req, res){
    res.status(200).json("local 3000")
})

app.listen(port, function(){
    console.log(`server started at ${port}`)
})
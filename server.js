require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const eventRouter = require("./routes/events.route");
const authRouter = require("./routes/auth.route");
const port = 3000;
const app = express();
const PORT = process.env.PORT || 3000;

mongoose
  .connect(process.env.DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err.message);
    process.exit(1);
  });

app.use(express.json());
app.use("/api/event", eventRouter);
app.use("/api/auth", authRouter);

app.get("/user", function (req, res) {
  res.status(200).json("local 3000");
});

app.get("/", (req, res) => {
    res.send("Welcome to Crowd Find API");
  });

  app.all("/", (req, res) => {
    res.status(405).send({ error: "Method Not Allowed" });
  });

app.listen(PORT, function () {
  console.log(`server started at ${PORT}`);
});
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const eventRouter = require("./routes/events.route");
const authRouter = require("./routes/auth.route");
const path = require('path');
const app = express();
const PORT = process.env.PORT || port;

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

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files email verification
app.use(express.static(path.join(__dirname, "public")));

// Routes
app.use("/api/event", eventRouter);
app.use("/api/auth", authRouter);

// Welcome Route
app.get("/", (req, res) => {
    res.send("Welcome to Crowd Find API");
});

app.all("*", (req, res) => {
    res.status(405).send({ error: "Method Not Allowed" });
});

app.listen(PORT, function () {
    console.log(`Server started at port ${PORT}`);
});

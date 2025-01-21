const express = require("express");
const apiRouter = require("./routes/api.routes");

const app = express();

app.use(express.json());
app.use("/api", apiRouter);

module.exports = app;

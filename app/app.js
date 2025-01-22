const express = require("express");
const apiRouter = require("./routes/api.routes");
const AppError = require("./utils/app-error");
const errorHandler = require("./middlewares/error-handler");

const app = express();

app.use(express.json());
app.use("/api", apiRouter);

app.all("*", (req, res, next) => {
  next(AppError.notFound(`Can't find ${req.originalUrl} on this server`));
});

app.use(errorHandler);

module.exports = app;

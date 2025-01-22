const express = require("express");
const apiRouter = require("./routes/api.routes");

const app = express();

app.use(express.json());
app.use("/api", apiRouter);

app.all("*", (req, res, next) => {
  next(new CustomError(404, `Can't find ${req.originalUrl} on this server`));
});

app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
});
module.exports = app;

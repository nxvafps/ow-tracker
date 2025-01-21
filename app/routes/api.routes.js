const apiRouter = require("express").Router();
const ApiController = require("../controllers/api.controller");
const mapRouter = require("./map.routes");
const heroRouter = require("./hero.routes");

apiRouter.get("/healthcheck", ApiController.getHealthCheck);
apiRouter.use("/map", mapRouter);
apiRouter.use("/heroes", heroRouter);

module.exports = apiRouter;

const apiRouter = require("express").Router();
const ApiController = require("../controllers/api.controller");
const mapRouter = require("./map.routes");
const heroRouter = require("./hero.routes");
const userRouter = require("./user.routes");
const gameRouter = require("./game.routes");

apiRouter.get("/healthcheck", ApiController.getHealthCheck);
apiRouter.use("/maps", mapRouter);
apiRouter.use("/heroes", heroRouter);
apiRouter.use("/users", userRouter);
apiRouter.use("/games", gameRouter);

module.exports = apiRouter;

const express = require("express");
const router = express.Router();
const gameController = require("../controllers/game.controller");

router.post("/", gameController.createGame);
router.get("/:user_name", gameController.getGamesByUser);
router.get("/:user_name/:game_id", gameController.getGameById);

module.exports = router;

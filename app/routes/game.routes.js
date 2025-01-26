const express = require("express");
const router = express.Router();
const gameController = require("../controllers/game.controller");

router.post("/", gameController.createGame);

module.exports = router;

const gameModel = require("../models/game.model");
const AppError = require("../utils/app-error");

class GameController {
  async createGame(req, res, next) {
    try {
      const gameData = req.body;
      const requiredFields = [
        "season",
        "user_name",
        "role",
        "map",
        "mode",
        "rounds",
        "team_score",
        "enemy_score",
        "result",
        "sr_change",
      ];

      if (!requiredFields.every((field) => field in gameData)) {
        throw AppError.badRequest("Bad request");
      }
      const game = await gameModel.createGame(gameData);
      res.status(201).json({ game });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new GameController();

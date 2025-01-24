const mapModel = require("../models/map.model.js");
const AppError = require("../utils/app-error");

class MapController {
  async getAllMaps(req, res, next) {
    try {
      const maps = await mapModel.getAllMaps();
      res.json({ maps });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new MapController();

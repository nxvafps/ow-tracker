// app/controllers/map.controller.js
const mapModel = require("../models/map.model.js");
const AppError = require("../utils/app-error");

class MapController {
  async getAllMaps(req, res, next) {
    try {
      const { game_mode, sort, has_submaps } = req.query;

      // Validate sort parameter
      if (sort && !["asc", "desc"].includes(sort.toLowerCase())) {
        throw AppError.badRequest("Bad request");
      }

      // Validate has_submaps parameter
      let hasSubmapsBoolean;
      if (has_submaps !== undefined) {
        if (has_submaps === "true") hasSubmapsBoolean = true;
        else if (has_submaps === "false") hasSubmapsBoolean = false;
        else throw AppError.badRequest("Bad request");
      }

      const maps = await mapModel.getAllMaps(
        game_mode,
        sort?.toLowerCase(),
        hasSubmapsBoolean
      );

      if (maps.length === 0) {
        throw AppError.notFound("Not found");
      }

      res.json({ maps });
    } catch (error) {
      next(error);
    }
  }
  async getMapByName(req, res, next) {
    try {
      const { map_name } = req.params;
      const map = await mapModel.getMapByName(map_name);

      if (!map.length) {
        throw AppError.notFound("Not found");
      }

      res.json({ map });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new MapController();

const mapModel = require("../models/map.model.js");
const AppError = require("../utils/app-error");

class MapController {
  async getMap(req, res) {
    try {
      const { mapName } = req.params;
      const mapData = await mapModel.getMapByName(mapName);

      if (!mapData.length) {
        throw AppError.notFound("Map not found");
      }

      res.json(mapData);
    } catch (error) {
      next(error);
    }
  }

  async getAllMaps(req, res) {
    try {
      const { mode } = req.query;
      const mapData = await mapModel.getAllMaps(mode);

      if (!mapData.length) {
        throw AppError.notFound(
          mode ? "No maps found for this mode" : "Maps not found"
        );
      }

      res.json(mapData);
    } catch (error) {
      console.error("Error:", error);
      next(error);
    }
  }
}

module.exports = new MapController();

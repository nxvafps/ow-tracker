const mapModel = require("../models/map.model.js");

class MapController {
  async getMap(req, res) {
    try {
      const { mapName } = req.params;
      const mapData = await mapModel.getMapByName(mapName);

      if (!mapData.length) {
        return res.status(404).json({ message: "Map not found" });
      }

      res.json(mapData);
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  async getAllMaps(req, res) {
    try {
      const { mode } = req.query;
      const mapData = await mapModel.getAllMaps(mode);
      if (!mapData.length) {
        return res.status(404).json({
          message: mode ? "No maps found for this mode" : "Maps not found",
        });
      }

      res.json(mapData);
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
}

module.exports = new MapController();

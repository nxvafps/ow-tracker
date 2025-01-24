const db = require("../db");

class MapModel {
  async getAllMaps() {
    const query = `
      SELECT 
        map_name as map,
        game_mode,
        submaps,
        distances
      FROM maps;`;

    const { rows } = await db.query(query);
    return rows;
  }

  formatMapName(mapName) {
    return mapName
      .replace(/-/g, " ")
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  }
}

module.exports = new MapModel();

const db = require("../db");
const mapsReference = require("./utils/maps-reference");

class MapModel {
  async getAllMaps(gameMode, sort, hasSubmaps) {
    let query = `
      SELECT 
        map_name as map,
        game_mode,
        submaps,
        distances
      FROM maps`;

    const queryParams = [];
    const conditions = [];

    if (gameMode) {
      queryParams.push(gameMode);
      conditions.push(`LOWER(game_mode) = LOWER($${queryParams.length})`);
    }

    if (hasSubmaps !== undefined) {
      queryParams.push(hasSubmaps);
      conditions.push(`(submaps IS NOT NULL) = $${queryParams.length}`);
    }

    if (conditions.length > 0) {
      query += ` WHERE ${conditions.join(" AND ")}`;
    }

    if (sort) {
      query += ` ORDER BY map_name ${sort.toUpperCase()}`;
    }

    query += ";";

    const { rows } = await db.query(query, queryParams);
    return rows;
  }

  async getMapByName(mapSlug) {
    const properMapName = mapsReference[mapSlug];

    if (!properMapName) {
      return [];
    }

    const query = `
      SELECT 
        map_name as map,
        game_mode,
        submaps,
        distances
      FROM maps
      WHERE map_name = $1;
    `;

    const { rows } = await db.query(query, [properMapName]);
    return rows;
  }
}

module.exports = new MapModel();

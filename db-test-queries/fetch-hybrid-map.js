const db = require("../db/index.js");

const fetchHybridMap = async (mapName) => {
  try {
    const result = await db.query(
      `
        SELECT maps.map_name AS map, game_modes.game_mode_name AS game_mode, hybrid_details.distance_1, hybrid_details.distance_2
        FROM maps
        JOIN game_modes ON maps.game_mode_id = game_modes.game_mode_id
        JOIN hybrid_details ON maps.map_id = hybrid_details.map_id
        WHERE maps.map_name = $1`,
      [mapName]
    );
    console.log("Hybrid map:");
    console.log(result.rows);
    return result.rows;
  } catch (error) {
    console.error("Error:", error);
  } finally {
    db.end();
  }
};

module.exports = fetchHybridMap;

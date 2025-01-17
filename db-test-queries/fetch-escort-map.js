const db = require("../db/index.js");

const fetchEscortMap = async (mapName) => {
  try {
    const result = await db.query(
      `
      SELECT maps.map_name AS map, game_modes.game_mode_name as game_mode, escort_details.distance_1, escort_details.distance_2, escort_details.distance_3
      FROM maps
      JOIN game_modes ON maps.game_mode_id = game_modes.game_mode_id
      JOIN escort_details ON maps.map_id = escort_details.map_id
      WHERE maps.map_name = $1`,
      [mapName]
    );
    console.log("Escort map:");
    console.log(result.rows);
    return result.rows;
  } catch (error) {
    console.error("Error:", error);
  } finally {
    db.end();
  }
};

module.exports = fetchEscortMap;

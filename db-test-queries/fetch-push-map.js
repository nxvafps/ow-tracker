const db = require("../db/index.js");

const fetchPushMap = async (mapName) => {
  try {
    const result = await db.query(
      `
        SELECT maps.map_name AS map, game_modes.game_mode_name AS game_mode, push_details.distance_1, push_details.distance_2
        FROM maps
        JOIN game_modes ON game_modes.game_mode_id = maps.game_mode_id
        JOIN push_details ON maps.map_id = push_details.map_id
        WHERE maps.map_name = $1`,
      [mapName]
    );
    console.log("Push map:");
    console.log(result.rows);
    return result.rows;
  } catch (error) {
    console.error("Error:", error);
  } finally {
    db.end();
  }
};

module.exports = fetchPushMap;

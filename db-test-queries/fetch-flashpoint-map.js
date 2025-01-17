const db = require("../db/index.js");

const fetchFlashpointMap = async (mapName) => {
  try {
    const result = await db.query(
      `
        SELECT maps.map_name AS map, game_modes.game_mode_name AS game_mode
        FROM maps
        JOIN game_modes ON maps.game_mode_id = game_modes.game_mode_id
        WHERE maps.map_name = $1`,
      [mapName]
    );
    console.log("Flashpoint map:");
    console.log(result.rows);
    return result.rows;
  } catch (error) {
    console.error("Error:", error);
  } finally {
    db.end();
  }
};

module.exports = fetchFlashpointMap;

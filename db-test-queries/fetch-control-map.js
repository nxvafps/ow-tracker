const db = require("../db/index.js");

const fetchControlMap = async (mapName) => {
  try {
    const result = await db.query(
      `
      SELECT 
        maps.map_name AS map,
        game_modes.game_mode_name AS game_mode,
        (array_agg(control_submaps.submap_name ORDER BY control_submaps.submap_id))[1] as submap_1,
        (array_agg(control_submaps.submap_name ORDER BY control_submaps.submap_id))[2] as submap_2,
        (array_agg(control_submaps.submap_name ORDER BY control_submaps.submap_id))[3] as submap_3
      FROM maps
      JOIN game_modes ON maps.game_mode_id = game_modes.game_mode_id
      JOIN control_submaps ON maps.map_id = control_submaps.map_id
      WHERE maps.game_mode_id = 2 AND maps.map_name = $1
      GROUP BY maps.map_name, game_modes.game_mode_name
      ORDER BY map;
    `,
      [mapName]
    );
    console.log("Control map:");
    console.log(result.rows);
    return result.rows;
  } catch (error) {
    throw error;
  } finally {
    db.end();
  }
};

module.exports = fetchControlMap;

const db = require("../db/index.js");

const fetchAllControlMaps = async () => {
  try {
    const result = await db.query(`
      SELECT 
        maps.map_name,
        (array_agg(control_submaps.submap_name ORDER BY control_submaps.submap_id))[1] as submap_1,
        (array_agg(control_submaps.submap_name ORDER BY control_submaps.submap_id))[2] as submap_2,
        (array_agg(control_submaps.submap_name ORDER BY control_submaps.submap_id))[3] as submap_3
      FROM maps maps
      JOIN control_submaps control_submaps ON maps.map_id = control_submaps.map_id
      WHERE maps.game_mode_id = 2
      GROUP BY maps.map_name
      ORDER BY maps.map_name;
    `);
    console.log("All control maps:");
    console.log(result.rows);
    return result.rows;
  } catch (error) {
    console.error("Error:", error);
  } finally {
    db.end();
  }
};

module.exports = fetchAllControlMaps;

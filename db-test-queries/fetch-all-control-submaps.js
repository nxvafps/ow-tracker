const db = require("../db/index.js");

const fetchAllControlSubmaps = async () => {
  try {
    const result = await db.query(`
        SELECT maps.map_name, control_submaps.submap_name
        FROM maps
        JOIN control_submaps ON maps.map_id = control_submaps.map_id
        ORDER BY maps.map_id ASC`);
    console.log("All control submaps:");
    console.log(result.rows);
    return result.rows;
  } catch (error) {
    console.error("Error:", error);
  } finally {
    db.end();
  }
};

module.exports = fetchAllControlSubmaps;

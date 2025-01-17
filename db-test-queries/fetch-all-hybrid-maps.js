const db = require("../db/index.js");

const fetchAllHybridMaps = async () => {
  try {
    const result = await db.query(`
        SELECT maps.map_name, hybrid_details.distance_1, hybrid_details.distance_2
        FROM maps
        JOIN hybrid_details ON maps.map_id = hybrid_details.map_id;`);
    console.log("All hybrid maps:");
    console.log(result.rows);
    return result.rows;
  } catch (error) {
    console.error("Error:", error);
  } finally {
    db.end();
  }
};

module.exports = fetchAllHybridMaps;

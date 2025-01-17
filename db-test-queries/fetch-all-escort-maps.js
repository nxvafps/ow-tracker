const db = require("../db/index.js");

const fetchAllEscortMaps = async () => {
  try {
    const result = await db.query(`
      SELECT maps.map_name, escort_details.distance_1, escort_details.distance_2, escort_details.distance_3
      FROM maps
      JOIN escort_details ON maps.map_id = escort_details.map_id;`);
    console.log("All escort maps:");
    console.log(result.rows);
    return result.rows;
  } catch (error) {
    console.error("Error:", error);
  } finally {
    db.end();
  }
};

module.exports = fetchAllEscortMaps;

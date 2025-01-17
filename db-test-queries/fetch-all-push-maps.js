const db = require("../db/index.js");

const fetchAllPushMaps = async () => {
  try {
    const result = await db.query(`
        SELECT maps.map_name, push_details.distance_1, push_details.distance_2
        FROM maps
        JOIN push_details ON maps.map_id = push_details.map_id;`);
    console.log("All push maps:");
    console.log(result.rows);
    return result.rows;
  } catch (error) {
    console.error("Error:", error);
  } finally {
    db.end();
  }
};
fetchAllPushMaps();
module.exports = fetchAllPushMaps;

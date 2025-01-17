const db = require("../db/index.js");
const fetchTable = require("./fetch-table");

const fetchAllTables = async () => {
  const allTables = [
    "game_modes",
    "maps",
    "control_submaps",
    "hybrid_details",
    "push_details",
    "escort_details",
    "roles",
    "heroes",
    "users",
    "games",
    "clash_games",
  ];

  try {
    await Promise.all(allTables.map((table) => fetchTable(table, false)));
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await db.end();
  }
};

module.exports = fetchAllTables;

const db = require("../db/index.js");

const fetchTable = async (table, closeDb = true) => {
  try {
    const result = await db.query(`SELECT * FROM ${table}`);
    console.log(`\n${table}:`);
    console.log(result.rows);
    return result.rows;
  } catch (error) {
    console.error("Error:", error);
  } finally {
    if (closeDb) db.end();
  }
};

module.exports = fetchTable;

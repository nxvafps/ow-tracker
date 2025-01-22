const format = require("pg-format");
const db = require("./index");
const formatData = require("./utils/formatData");

const insertRoles = async (roles) => {
  const sql = format(
    "INSERT INTO roles (role_name) VALUES %L RETURNING *",
    formatData(roles)
  );
  const { rows } = await db.query(sql);
  //console.log("Inserted roles:", rows);
  return rows;
};

const insertHeroes = async (heroes) => {
  const sql = format(
    "INSERT INTO heroes (hero_name, role_id) VALUES %L RETURNING *",
    formatData(heroes)
  );
  const { rows } = await db.query(sql);
  //console.log("Inserted heroes:", rows);
  return rows;
};

const insertMaps = async (maps) => {
  const sql = format(
    "INSERT INTO maps (map_name, game_mode, submaps, distances) VALUES %L RETURNING *",
    formatData(maps)
  );
  const { rows } = await db.query(sql);
  //console.log("Inserted maps:", rows);
  return rows;
};
module.exports = { insertRoles, insertHeroes, insertMaps };

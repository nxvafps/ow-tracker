const format = require("pg-format");
const db = require("../");
const formatData = require("./formatData");

const insertRoles = async (roles) => {
  const sql = format(
    "INSERT INTO roles (role_name) VALUES %L RETURNING *",
    formatData(roles)
  );
  const { rows } = await db.query(sql);
  if (process.env.NODE_ENV !== "test") console.log("Inserted roles:", rows);
  return rows;
};

const insertHeroes = async (heroes) => {
  const sql = format(
    "INSERT INTO heroes (hero_name, role_id) VALUES %L RETURNING *",
    formatData(heroes)
  );
  const { rows } = await db.query(sql);
  if (process.env.NODE_ENV !== "test") console.log("Inserted heroes:", rows);
  return rows;
};

const insertMaps = async (maps) => {
  const sql = format(
    "INSERT INTO maps (map_name, game_mode, submaps, distances) VALUES %L RETURNING *",
    formatData(maps)
  );
  const { rows } = await db.query(sql);
  if (process.env.NODE_ENV !== "test") console.log("Inserted maps:", rows);
  return rows;
};

const insertUsers = async (users) => {
  const sql = format(
    "INSERT INTO users (user_name, user_main_role, user_main_hero, dps_sr, support_sr, tank_sr) VALUES %L RETURNING *",
    formatData(users)
  );
  const { rows } = await db.query(sql);
  if (process.env.NODE_ENV !== "test") console.log("Inserted users:", rows);
  return rows;
};
module.exports = { insertRoles, insertHeroes, insertMaps, insertUsers };

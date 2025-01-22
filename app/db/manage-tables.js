const db = require("./index");

const createRoles = async () => {
  return db.query(`
    CREATE TABLE roles(
      role_id SERIAL PRIMARY KEY,
      role_name VARCHAR(7)
    )`);
};

const createHeroes = async () => {
  return db.query(`
    CREATE TABLE heroes (
      hero_id SERIAL PRIMARY KEY,
      hero_name VARCHAR(20) NOT NULL,
      role_id INT REFERENCES roles(role_id) NOT NULL
      )
      `);
};

const createMaps = async () => {
  return db.query(`
    CREATE TABLE maps (
      map_id SERIAL PRIMARY KEY,
      map_name VARCHAR(40) NOT NULL,
      game_mode VARCHAR(10) NOT NULL,
      submaps JSONB,
      distances JSONB
    )
    `);
};

const createUsers = async () => {
  return db.query(`
    CREATE TABLE users (
      user_id SERIAL PRIMARY KEY,
      user_name VARCHAR(15) NOT NULL,
      user_main_role INTEGER REFERENCES roles(role_id),
      user_main_hero INTEGER REFERENCES heroes(hero_id),
      dps_sr INTEGER,
      support_sr INTEGER,
      tank_sr INTEGER
    );
    `);
};
module.exports = { createRoles, createMaps, createHeroes, createUsers };

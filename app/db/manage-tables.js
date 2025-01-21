const db = require("./index");

const createRoles = async () => {
  return db.query(`
    CREATE TABLE roles(
      role_id SERIAL PRIMARY KEY,
      role_name VARCHAR(7)
    )`);
};
const createMaps = async () => {
  return db.query(`
    CREATE TABLE maps (
      map_id SERIAL PRIMARY KEY,
      map_name VARCHAR(40) NOT NULL,
      game_mode VARCHAR(10) NOT NULL,
      submaps VARCHAR[],
      distances VARCHAR[]
    )
    `);
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

module.exports = { createRoles, createMaps, createHeroes };

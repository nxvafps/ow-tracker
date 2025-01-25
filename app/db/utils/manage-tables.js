const db = require("../");

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

const createGames = async () => {
  return db.query(`
    CREATE TABLE games (
        game_id SERIAL PRIMARY KEY,
        season INTEGER NOT NULL,
        user_id INTEGER REFERENCES users(user_id) NOT NULL,
        role_id INTEGER REFERENCES roles(role_id) NOT NULL,
        map_id INTEGER REFERENCES maps(map_id) NOT NULL,
        user_score INTEGER NOT NULL,
        enemy_score INTEGER NOT NULL,
        result VARCHAR(4) NOT NULL,
        sr_change INTEGER NOT NULL
      )
    `);
};

const createClashGames = async () => {
  return db.query(`
    CREATE TABLE clash_games (
      clash_game_id SERIAL PRIMARY KEY,
      game_id INTEGER REFERENCES games(game_id),
      hero_id_1 INTEGER REFERENCES heroes(hero_id) NOT NULL,
      hero_id_2 INTEGER REFERENCES heroes(hero_id),
      hero_id_3 INTEGER REFERENCES heroes(hero_id),
      team_score INTEGER NOT NULL,
      enemy_score INTEGER NOT NULL
    )`);
};

module.exports = {
  createRoles,
  createMaps,
  createHeroes,
  createUsers,
  createGames,
  createClashGames,
};

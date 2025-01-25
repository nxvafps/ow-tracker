const db = require("./index");
const {
  createRoles,
  createHeroes,
  createMaps,
} = require("./utils/manage-tables");
const {
  insertRoles,
  insertHeroes,
  insertMaps,
} = require("./utils/insert-data");
const formatHeroes = require("./utils/formatHeroes");

// async function seed() {
//   const client = await pool.connect();

//   try {
//     await client.query("BEGIN");

//     await client.query("DROP DATABASE IF EXISTS overwatch_tracker");
//     await client.query("CREATE DATABASE overwatch_tracker");

//     const dropTables = `
//       DROP TABLE IF EXISTS control_games, escort_games, flashpoint_games,
//       hybrid_games, push_games, clash_games, games, users, heroes, roles,
//       push_details, escort_details, hybrid_details, control_submaps, maps,
//       game_modes CASCADE
//     `;
//     await client.query(dropTables);

//     await client.query(`
//       CREATE TABLE game_modes (
//         game_mode_id SERIAL PRIMARY KEY,
//         game_mode_name VARCHAR(15)
//       )
//     `);

//     // Insert game modes
//     const gameModes = [
//       "Clash",
//       "Control",
//       "Escort",
//       "Flashpoint",
//       "Hybrid",
//       "Push",
//     ];

//     await client.query(
//       `
//       INSERT INTO game_modes (game_mode_name)
//       VALUES ${gameModes.map((mode, i) => `($${i + 1})`).join(", ")}
//     `,
//       gameModes
//     );

//     await client.query(
//       `
//       CREATE TABLE maps (
//         map_id SERIAL PRIMARY KEY,
//         map_name VARCHAR(40),
//         game_mode_id INTEGER REFERENCES game_modes(game_mode_id)
//       )
//       `
//     );

//     const maps = [
//       ["Antarctic Peninsula", 2],
//       ["Blizzard World", 5],
//       ["Busan", 2],
//       ["Circuit Royale", 3],
//       ["Colosseo", 6],
//       ["Dorado", 3],
//       ["Eichenwalde", 5],
//       ["Esperanca", 6],
//       ["Hanaoka", 1],
//       ["Havana", 3],
//       ["Hollywood", 5],
//       ["Illios", 2],
//       ["Junkertown", 3],
//       ["King's Row", 5],
//       ["Lijiang Tower", 2],
//       ["Midtown", 5],
//       ["Nepal", 2],
//       ["New Junk City", 4],
//       ["New Queen Street", 6],
//       ["Numbani", 5],
//       ["Oasis", 2],
//       ["Paraiso", 5],
//       ["Rialto", 3],
//       ["Route 66", 3],
//       ["Runasapi", 6],
//       ["Samoa", 2],
//       ["Shambali Monastary", 3],
//       ["Suravasa", 4],
//       ["Throne of Annubis", 1],
//       ["Watchpoint: Gibraltar", 3],
//     ];

//     await client.query(
//       `
//       INSERT INTO maps (map_name, game_mode_id)
//       VALUES ${maps.map((_, i) => `($${i * 2 + 1}, $${i * 2 + 2})`).join(", ")}
//     `,
//       maps.flat()
//     );

//     await client.query(
//       `
//       CREATE TABLE control_submaps (
//         submap_id SERIAL PRIMARY KEY,
//         map_id INTEGER REFERENCES maps(map_id),
//         submap_name VARCHAR(40)
//       )
//       `
//     );

//     await client.query(`
//       CREATE TABLE hybrid_details (
//         hybrid_details_id SERIAL PRIMARY KEY,
//         map_id INTEGER REFERENCES maps(map_id),
//         distance_1 NUMERIC,
//         distance_2 NUMERIC
//       )`);

//     await client.query(`
//       CREATE TABLE escort_details (
//         escort_details_id SERIAL PRIMARY KEY,
//         map_id INTEGER REFERENCES maps(map_id),
//         distance_1 NUMERIC,
//         distance_2 NUMERIC,
//         distance_3 NUMERIC
//       )`);

//     await client.query(`
//       CREATE TABLE push_details (
//         push_details_id SERIAL PRIMARY KEY,
//         map_id INTEGER REFERENCES maps(map_id),
//         distance_1 NUMERIC,
//         distance_2 NUMERIC
//       )`);

//     await client.query(`
//       CREATE TABLE roles (
//         role_id SERIAL PRIMARY KEY,
//         role_name VARCHAR(7)
//       )`);

//     await client.query(`
//       CREATE TABLE heroes (
//         hero_id SERIAL PRIMARY KEY,
//         hero_name VARCHAR(40) NOT NULL,
//         role_id INTEGER REFERENCES roles(role_id)
//       )`);

//     await client.query(`
//       CREATE TABLE users (
//         user_id SERIAL PRIMARY KEY,
//         user_name VARCHAR(15) NOT NULL,
//         user_main_role INTEGER REFERENCES roles(role_id),
//         user_main_hero INTEGER REFERENCES heroes(hero_id),
//         dps_sr INTEGER,
//         support_sr INTEGER,
//         tank_sr INTEGER
//       )`);

//     await client.query(`
//       CREATE TABLE games (
//         game_id SERIAL PRIMARY KEY,
//         season INTEGER NOT NULL,
//         user_id INTEGER REFERENCES users(user_id) NOT NULL,
//         role_id INTEGER REFERENCES roles(role_id) NOT NULL,
//         map_id INTEGER REFERENCES maps(map_id) NOT NULL,
//         user_score INTEGER NOT NULL,
//         enemy_score INTEGER NOT NULL,
//         result VARCHAR(4) NOT NULL,
//         sr_change INTEGER NOT NULL
//       )`);

//     await client.query(`
//       CREATE TABLE clash_games (
//         clash_game_id SERIAL PRIMARY KEY,
//         game_id INTEGER REFERENCES games(game_id),
//         hero_id_1 INTEGER REFERENCES heroes(hero_id) NOT NULL,
//         hero_id_2 INTEGER REFERENCES heroes(hero_id),
//         hero_id_3 INTEGER REFERENCES heroes(hero_id),
//         team_score INTEGER NOT NULL,
//         enemy_score INTEGER NOT NULL
//       )`);
//   } catch (error) {}
// }

const seed = async ({ roles, heroes, maps }) => {
  console.log(`Seeding on ${process.env.PGDATABASE}`);
  await db.query("DROP TABLE IF EXISTS maps");
  await db.query("DROP TABLE IF EXISTS heroes");
  await db.query("DROP TABLE IF EXISTS roles");

  await createRoles();
  await createHeroes();
  await createMaps();

  const insertedRoles = await insertRoles(roles);
  //console.log(`Seeded ${insertedRoles.length} roles`);

  const insertedHeroes = await insertHeroes(
    formatHeroes(heroes, insertedRoles)
  );
  //console.log(`Seeded ${insertedHeroes.length} heroes`);

  const insertedMaps = await insertMaps(maps);
  //console.log(`Seeded ${insertedMaps.length} maps`);

  return { heroes: insertedHeroes, roles: insertedRoles };
};

module.exports = seed;

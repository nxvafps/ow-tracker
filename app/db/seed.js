const db = require("./index");
const {
  createRoles,
  createHeroes,
  createMaps,
  createUsers,
  createGames,
  createClashGames,
  createControlGames,
  createEscortGames,
  createFlashpointGames,
  createHybridGames,
  createPushGames,
} = require("./utils/manage-tables");
const {
  insertRoles,
  insertHeroes,
  insertMaps,
  insertUsers,
} = require("./utils/insert-data");
const formatHeroes = require("./utils/formatHeroes");
const formatUsers = require("./utils/formatUsers");

const seed = async ({ roles, heroes, maps, users }) => {
  console.log(`Seeding on ${process.env.PGDATABASE}`);
  await db.query("DROP TABLE IF EXISTS push_games");
  await db.query("DROP TABLE IF EXISTS hybrid_games");
  await db.query("DROP TABLE IF EXISTS flashpoint_games");
  await db.query("DROP TABLE IF EXISTS escort_games");
  await db.query("DROP TABLE IF EXISTS control_games");
  await db.query("DROP TABLE IF EXISTS clash_games");
  await db.query("DROP TABLE IF EXISTS games");
  await db.query("DROP TABLE IF EXISTS users");
  await db.query("DROP TABLE IF EXISTS maps");
  await db.query("DROP TABLE IF EXISTS heroes");
  await db.query("DROP TABLE IF EXISTS roles");

  await createRoles();
  await createHeroes();
  await createMaps();
  await createUsers();
  await createGames();
  await createClashGames();
  await createControlGames();
  await createEscortGames();
  await createFlashpointGames();
  await createHybridGames();
  await createPushGames();

  const insertedRoles = await insertRoles(roles);
  if (process.env.NODE_ENV !== "test")
    console.log(`Seeded ${insertedRoles.length} roles`);

  const insertedHeroes = await insertHeroes(
    formatHeroes(heroes, insertedRoles)
  );
  if (process.env.NODE_ENV !== "test")
    console.log(`Seeded ${insertedHeroes.length} heroes`);

  const insertedMaps = await insertMaps(maps);
  if (process.env.NODE_ENV !== "test")
    console.log(`Seeded ${insertedMaps.length} maps`);

  const insertedUsers = await insertUsers(
    formatUsers(users, insertedHeroes, insertedRoles)
  );
  if (process.env.NODE_ENV !== "test")
    console.log(`Seeded ${insertedUsers.length} users`);

  return {
    heroes: insertedHeroes,
    roles: insertedRoles,
    maps: insertedMaps,
    users: insertedUsers,
  };
};

module.exports = seed;

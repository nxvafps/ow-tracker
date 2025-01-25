const db = require("./index");
const {
  createRoles,
  createHeroes,
  createMaps,
  createUsers,
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
  await db.query("DROP TABLE IF EXISTS users");
  await db.query("DROP TABLE IF EXISTS maps");
  await db.query("DROP TABLE IF EXISTS heroes");
  await db.query("DROP TABLE IF EXISTS roles");

  await createRoles();
  await createHeroes();
  await createMaps();
  await createUsers();

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

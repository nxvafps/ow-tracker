const seed = require("./seed");
const data = require("./data");
const db = require("./");

const runSeed = async () => {
  try {
    await seed(data);
  } catch (err) {
    console.log(err);
    throw err;
  }
};

module.exports = runSeed;

if (require.main === module) {
  runSeed()
    .then(() => db.end())
    .catch((err) => {
      console.error(err);
      db.end();
      process.exit(1);
    });
}

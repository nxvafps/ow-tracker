const seed = require("./seed");
const testData = require("./data/test-data");
const devData = require("./data/dev-data");
const db = require("./");

const data = process.env.NODE_ENV === "test" ? testData : devData;

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

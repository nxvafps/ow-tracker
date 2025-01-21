const seed = require("./seed");
const data = require("./data");

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
  runSeed();
}

const express = require("express");
const mapRoutes = require("./routes/map.routes");
const heroRoutes = require("./routes/hero.routes");

const app = express();

app.use("/api/maps", mapRoutes);
app.use("/api/heroes", heroRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something broke!" });
});

module.exports = app;

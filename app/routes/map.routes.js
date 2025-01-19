const express = require("express");
const router = express.Router();
const mapController = require("../controllers/map.controller");

router.get("/", mapController.getAllMaps);
router.get("/:mapName", mapController.getMap);

module.exports = router;

const express = require("express");
const router = express.Router();
const mapController = require("../controllers/map.controller");

router.get("/", mapController.getAllMaps);
router.get("/:map_name", mapController.getMapByName);

module.exports = router;

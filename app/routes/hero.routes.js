const express = require("express");
const router = express.Router();
const heroController = require("../controllers/hero.controller");

router.get("/", heroController.getAllHeroes);
router.get("/:heroName", heroController.getHero);

module.exports = router;

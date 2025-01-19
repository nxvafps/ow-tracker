const heroModel = require("../models/hero.model.js");

class HeroController {
  async getHero(req, res) {
    try {
      const { heroName } = req.params;
      const heroData = await heroModel.getHeroByName(heroName);

      if (!heroData.length) {
        return res.status(404).json({ message: "Hero not found" });
      }

      res.json(heroData);
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  async getAllHeroes(req, res) {
    try {
      const { role } = req.query;
      let heroData;

      if (role) {
        heroData = await heroModel.getHeroesByRole(role);
        if (!heroData.length) {
          return res
            .status(404)
            .json({ message: "No heroes found for this role" });
        }
      } else {
        heroData = await heroModel.getAllHeroes();
        if (!heroData.length) {
          return res.status(404).json({ message: "Heroes not found" });
        }
      }

      res.json(heroData);
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
}

module.exports = new HeroController();

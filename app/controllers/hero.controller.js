const heroModel = require("../models/hero.model.js");

class HeroController {
  async getHero(req, res) {
    try {
      const { heroName } = req.params;
      const hero = await heroModel.getHeroByName(heroName);

      if (!hero.length) {
        return res.status(404).json({ message: "Hero not found" });
      }

      res.json({ hero });
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  async getAllHeroes(req, res) {
    try {
      const { role } = req.query;
      let heroes;

      if (role) {
        heroes = await heroModel.getHeroesByRole(role);
        if (!heroes.length) {
          return res.status(404).json({
            message: "No heroes found for this role",
          });
        }
      } else {
        heroes = await heroModel.getAllHeroes();
        if (!heroes.length) {
          return res.status(404).json({
            message: "Heroes not found",
          });
        }
      }

      res.json({ heroes });
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
}

module.exports = new HeroController();

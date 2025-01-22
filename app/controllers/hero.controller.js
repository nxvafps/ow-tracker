const heroModel = require("../models/hero.model.js");
const CustomError = require("../errors/customError.js");

class HeroController {
  async getHero(req, res, next) {
    try {
      const { heroName } = req.params;
      const hero = await heroModel.getHeroByName(heroName);

      if (!hero.length) {
        return next(new CustomError(404, "Hero not found"));
      }

      res.json({ hero });
    } catch (error) {
      next(error);
    }
  }

  async getAllHeroes(req, res, next) {
    try {
      const { role } = req.query;

      if (role && !isNaN(role)) {
        throw new CustomError(400, "Invalid input: role must be a string");
      }

      const heroes = role
        ? await heroModel.getHeroesByRole(role)
        : await heroModel.getAllHeroes();

      if (!heroes.length) {
        throw new CustomError(
          404,
          role ? `No heroes found with role: ${role}` : "Heroes not found"
        );
      }

      res.json({ heroes });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new HeroController();

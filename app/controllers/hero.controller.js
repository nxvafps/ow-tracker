const heroModel = require("../models/hero.model.js");

class HeroController {
  async getHero(req, res, next) {
    try {
      const { heroName } = req.params;
      const hero = await heroModel.getHeroByName(heroName);

      if (!hero.length) {
        return next({
          statusCode: 404,
          status: "fail",
          message: "Hero not found",
        });
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
        return next({
          statusCode: 400,
          status: "fail",
          message: "Invalid input: role must be a string",
        });
      }

      const heroes = role
        ? await heroModel.getHeroesByRole(role)
        : await heroModel.getAllHeroes();

      if (!heroes.length) {
        return next({
          statusCode: 404,
          status: "fail",
          message: role
            ? `No heroes found with role: ${role}`
            : "Heroes not found",
        });
      }

      res.json({ heroes });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new HeroController();

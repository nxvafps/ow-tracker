const heroModel = require("../models/hero.model.js");
const AppError = require("../utils/app-error.js");

class HeroController {
  async getHero(req, res, next) {
    try {
      const { heroName } = req.params;
      const hero = await heroModel.getHeroByName(heroName);

      if (!hero) {
        throw AppError.notFound(`Hero not found`);
      }

      res.json({ hero });
    } catch (error) {
      next(error);
    }
  }

  async getAllHeroes(req, res, next) {
    try {
      const { role, order } = req.query;

      if (role && !isNaN(role)) {
        throw AppError.badRequest("Invalid input: role must be a string");
      }

      if (order && !["asc", "desc"].includes(order.toLowerCase())) {
        throw AppError.badRequest(
          "Invalid order query - must be 'asc' or 'desc'"
        );
      }

      const heroes = await heroModel.getAllHeroes(order, role);

      if (!heroes.length) {
        throw AppError.notFound(
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

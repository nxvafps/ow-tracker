const db = require("../db");

class HeroModel {
  async getAllHeroes() {
    const query = `
      SELECT heroes.hero_name, roles.role_name
      FROM heroes
      LEFT JOIN roles ON heroes.role_id = roles.role_id;`;

    const result = await db.query(query);
    return result.rows;
  }

  async getHeroByName(heroName) {
    const formattedName = this.formatHeroName(heroName);
    const query = `
      SELECT heroes.hero_name, roles.role_name
      FROM heroes
      LEFT JOIN roles ON heroes.role_id = roles.role_id
      WHERE LOWER(heroes.hero_name) = LOWER($1);`;

    const result = await db.query(query, [formattedName]);
    return result.rows;
  }

  async getHeroesByRole(roleName) {
    const query = `
        SELECT heroes.hero_name, roles.role_name
        FROM heroes
        LEFT JOIN roles ON heroes.role_id = roles.role_id
        WHERE LOWER(roles.role_name) = LOWER($1);`;

    const result = await db.query(query, [roleName]);
    return result.rows;
  }

  formatHeroName(heroName) {
    return heroName
      .replace(/-/g, " ")
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  }
}

module.exports = new HeroModel();

const db = require("../db");

class HeroModel {
  async getAllHeroes() {
    const query = `
      SELECT heroes.hero_name, roles.role_name
      FROM heroes
      JOIN roles ON heroes.role_id = roles.role_id;`;

    const { rows } = await db.query(query);
    return rows;
  }

  async getHeroByName(heroName) {
    const formattedName = this.formatHeroName(heroName);
    const query = `
      SELECT heroes.hero_name, roles.role_name
      FROM heroes
      JOIN roles ON heroes.role_id = roles.role_id
      WHERE LOWER(hero_name) = LOWER($1);`;

    const { rows } = await db.query(query, [formattedName]);
    return rows;
  }

  async getHeroesByRole(roleName) {
    const query = `
        SELECT heroes.hero_name, roles.role_name
        FROM heroes
        JOIN roles ON heroes.role_id = roles.role_id
        WHERE LOWER(role_name) = LOWER($1)
        ORDER BY hero_name;`;

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

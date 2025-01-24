const db = require("../db");
require("jest-sorted");
class HeroModel {
  async getAllHeroes(order, role) {
    const baseQuery = `
      SELECT heroes.hero_name, roles.role_name
      FROM heroes
      JOIN roles ON heroes.role_id = roles.role_id`;

    const whereClause = role ? `WHERE LOWER(role_name) = LOWER($1)` : "";
    const orderClause = order
      ? `ORDER BY heroes.hero_id ${order.toUpperCase()}`
      : "ORDER BY hero_id";

    const query = `${baseQuery} ${whereClause} ${orderClause};`;

    const params = role ? [role] : [];
    const { rows } = await db.query(query, params);
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

  formatHeroName(heroName) {
    return heroName
      .replace(/-/g, " ")
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  }
}

module.exports = new HeroModel();

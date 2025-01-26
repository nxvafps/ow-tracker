const db = require("../db");
const AppError = require("../utils/app-error");

class UserModel {
  async getAllUsers() {
    const query = `
      SELECT 
        users.user_name,
        roles.role_name as user_main_role,
        heroes.hero_name as user_main_hero,
        users.dps_sr,
        users.support_sr,
        users.tank_sr
      FROM users
      JOIN roles ON users.user_main_role = roles.role_id
      JOIN heroes ON users.user_main_hero = heroes.hero_id;
    `;

    const { rows } = await db.query(query);
    return rows;
  }

  async getUserByName(user_name) {
    const query = `
      SELECT 
        users.user_name,
        roles.role_name as user_main_role,
        heroes.hero_name as user_main_hero,
        users.dps_sr,
        users.support_sr,
        users.tank_sr
      FROM users
      JOIN roles ON users.user_main_role = roles.role_id
      JOIN heroes ON users.user_main_hero = heroes.hero_id
      WHERE LOWER(users.user_name) = LOWER($1);
    `;

    const { rows } = await db.query(query, [user_name]);
    return rows;
  }

  async updateUserSR(userName, srUpdates) {
    for (const [role, value] of Object.entries(srUpdates)) {
      if (value !== null) {
        if (typeof value !== "number") {
          throw AppError.badRequest("Bad request");
        }
        if (value < 0 || value > 4000) {
          throw AppError.badRequest("Bad request");
        }
      }
    }

    const query = `
      UPDATE users 
      SET 
        dps_sr = COALESCE($1, dps_sr),
        support_sr = COALESCE($2, support_sr),
        tank_sr = COALESCE($3, tank_sr)
      FROM roles, heroes
      WHERE LOWER(users.user_name) = LOWER($4)
      AND users.user_main_role = roles.role_id 
      AND users.user_main_hero = heroes.hero_id
      RETURNING 
        users.user_name,
        roles.role_name as user_main_role,
        heroes.hero_name as user_main_hero,
        users.dps_sr,
        users.support_sr,
        users.tank_sr;
    `;

    const { rows } = await db.query(query, [
      srUpdates.dps_sr,
      srUpdates.support_sr,
      srUpdates.tank_sr,
      userName,
    ]);

    if (!rows.length) {
      throw AppError.notFound("Not found");
    }

    return rows[0];
  }
}

module.exports = new UserModel();

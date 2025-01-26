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

  async createUser(userData) {
    const srFields = ["dps_sr", "support_sr", "tank_sr"];
    srFields.forEach((field) => {
      if (
        userData[field] !== null &&
        (typeof userData[field] !== "number" ||
          userData[field] < 0 ||
          userData[field] > 4000)
      ) {
        throw AppError.badRequest("Bad request");
      }
    });

    const roleQuery = `
      SELECT role_id FROM roles 
      WHERE LOWER(role_name) = LOWER($1)
    `;
    const { rows: roleRows } = await db.query(roleQuery, [
      userData.user_main_role,
    ]);
    if (!roleRows.length) {
      throw AppError.badRequest("Bad request");
    }

    const heroQuery = `
      SELECT hero_id FROM heroes 
      WHERE LOWER(hero_name) = LOWER($1)
    `;
    const { rows: heroRows } = await db.query(heroQuery, [
      userData.user_main_hero,
    ]);
    if (!heroRows.length) {
      throw AppError.badRequest("Bad request");
    }

    const query = `
      INSERT INTO users (
        user_name, 
        user_main_role, 
        user_main_hero, 
        dps_sr, 
        support_sr, 
        tank_sr
      )
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING user_name, 
        (SELECT role_name FROM roles WHERE role_id = user_main_role) as user_main_role,
        (SELECT hero_name FROM heroes WHERE hero_id = user_main_hero) as user_main_hero,
        dps_sr, support_sr, tank_sr
    `;

    const values = [
      userData.user_name,
      roleRows[0].role_id,
      heroRows[0].hero_id,
      userData.dps_sr,
      userData.support_sr,
      userData.tank_sr,
    ];

    const { rows } = await db.query(query, values);
    return rows[0];
  }
}

module.exports = new UserModel();

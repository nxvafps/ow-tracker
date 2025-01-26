const db = require("../db");
const AppError = require("../utils/app-error");

class GameModel {
  async createGame(gameData) {
    const client = await db.connect();
    try {
      await client.query("BEGIN");

      const userResult = await client.query(
        "SELECT user_id FROM users WHERE LOWER(user_name) = LOWER($1)",
        [gameData.user_name]
      );

      if (!userResult.rows.length) {
        throw AppError.notFound("Not found");
      }
      const userId = userResult.rows[0].user_id;

      const roleResult = await client.query(
        "SELECT role_id FROM roles WHERE LOWER(role_name) = LOWER($1)",
        [gameData.role]
      );
      const roleId = roleResult.rows[0].role_id;

      const mapResult = await client.query(
        "SELECT map_id FROM maps WHERE LOWER(map_name) = LOWER($1)",
        [gameData.map]
      );
      const mapId = mapResult.rows[0].map_id;

      const gameResult = await client.query(
        `INSERT INTO games 
        (season, user_id, role_id, map_id, team_score, enemy_score, result, sr_change)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING *`,
        [
          gameData.season,
          userId,
          roleId,
          mapId,
          gameData.team_score,
          gameData.enemy_score,
          gameData.result,
          gameData.sr_change,
        ]
      );

      const game = gameResult.rows[0];
      const round = gameData.rounds[0];

      const heroIds = await Promise.all(
        [round.hero_1_name, round.hero_2_name, round.hero_3_name].map(
          async (heroName) => {
            if (!heroName) return null;
            const result = await client.query(
              "SELECT hero_id FROM heroes WHERE LOWER(hero_name) = LOWER($1)",
              [heroName]
            );
            return result.rows[0].hero_id;
          }
        )
      );

      if (gameData.mode === "Clash") {
        const clashResult = await client.query(
          `INSERT INTO clash_games 
          (game_id, hero_id_1, hero_id_2, hero_id_3, team_score, enemy_score)
          VALUES ($1, $2, $3, $4, $5, $6)
          RETURNING *`,
          [
            game.game_id,
            heroIds[0],
            heroIds[1],
            heroIds[2],
            round.team_score,
            round.enemy_score,
          ]
        );
        game.clash_game = clashResult.rows[0];
      }

      if (gameData.mode === "Control") {
        const controlGames = [];
        for (const round of gameData.rounds) {
          const heroIds = await Promise.all(
            [round.hero_1_name, round.hero_2_name, round.hero_3_name].map(
              async (heroName) => {
                if (!heroName) return null;
                const result = await client.query(
                  "SELECT hero_id FROM heroes WHERE LOWER(hero_name) = LOWER($1)",
                  [heroName]
                );
                return result.rows[0].hero_id;
              }
            )
          );

          const controlResult = await client.query(
            `INSERT INTO control_games 
            (game_id, round_number, submap_name, hero_id_1, hero_id_2, hero_id_3, team_score, enemy_score)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING *`,
            [
              game.game_id,
              round.round_number,
              round.submap_name,
              heroIds[0],
              heroIds[1],
              heroIds[2],
              round.team_score,
              round.enemy_score,
            ]
          );
          controlGames.push(controlResult.rows[0]);
        }
        game.control_game = controlGames;
      }

      if (gameData.mode === "Escort") {
        const escortGames = [];
        for (const round of gameData.rounds) {
          const heroIds = await Promise.all(
            [round.hero_1_name, round.hero_2_name, round.hero_3_name].map(
              async (heroName) => {
                if (!heroName) return null;
                const result = await client.query(
                  "SELECT hero_id FROM heroes WHERE LOWER(hero_name) = LOWER($1)",
                  [heroName]
                );
                return result.rows[0].hero_id;
              }
            )
          );

          const escortResult = await client.query(
            `INSERT INTO escort_games
            (game_id, round_number, starting_side, hero_id_1, hero_id_2, hero_id_3, score, sub_score)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING *`,
            [
              game.game_id,
              round.round_number,
              round.starting_side,
              ...heroIds,
              round.score,
              round.sub_score,
            ]
          );
          escortGames.push(escortResult.rows[0]);
        }
        game.escort_game = escortGames;
      }

      if (gameData.mode === "Flashpoint") {
        const round = gameData.rounds[0];
        const heroIds = await Promise.all(
          [round.hero_1_name, round.hero_2_name, round.hero_3_name].map(
            async (heroName) => {
              if (!heroName) return null;
              const result = await client.query(
                "SELECT hero_id FROM heroes WHERE LOWER(hero_name) = LOWER($1)",
                [heroName]
              );
              return result.rows[0].hero_id;
            }
          )
        );

        const flashpointResult = await client.query(
          `INSERT INTO flashpoint_games
          (game_id, hero_id_1, hero_id_2, hero_id_3, team_score, enemy_score)
          VALUES ($1, $2, $3, $4, $5, $6)
          RETURNING *`,
          [game.game_id, ...heroIds, round.team_score, round.enemy_score]
        );
        game.flashpoint_game = flashpointResult.rows[0];
      }

      if (gameData.mode === "Hybrid") {
        const hybridGames = [];
        for (const round of gameData.rounds) {
          const heroIds = await Promise.all(
            [round.hero_1_name, round.hero_2_name, round.hero_3_name].map(
              async (heroName) => {
                if (!heroName) return null;
                const result = await client.query(
                  "SELECT hero_id FROM heroes WHERE LOWER(hero_name) = LOWER($1)",
                  [heroName]
                );
                return result.rows[0].hero_id;
              }
            )
          );

          const hybridResult = await client.query(
            `INSERT INTO hybrid_games
            (game_id, round_number, starting_side, hero_id_1, hero_id_2, hero_id_3, score, sub_score)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING *`,
            [
              game.game_id, // Use game.game_id instead of game.rows[0].game_id
              round.round_number,
              round.starting_side,
              ...heroIds,
              round.score,
              round.sub_score,
            ]
          );
          hybridGames.push(hybridResult.rows[0]);
        }
        game.hybrid_game = hybridGames;
      }

      if (gameData.mode === "Push") {
        const round = gameData.rounds[0];
        const heroIds = await Promise.all(
          [round.hero_1_name, round.hero_2_name, round.hero_3_name].map(
            async (heroName) => {
              if (!heroName) return null;
              const result = await client.query(
                "SELECT hero_id FROM heroes WHERE LOWER(hero_name) = LOWER($1)",
                [heroName]
              );
              return result.rows[0].hero_id;
            }
          )
        );

        const pushResult = await client.query(
          `INSERT INTO push_games
          (game_id, hero_id_1, hero_id_2, hero_id_3, team_score, team_distance, enemy_score, enemy_distance)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
          RETURNING *`,
          [
            game.game_id,
            ...heroIds,
            round.team_score,
            round.team_distance,
            round.enemy_score,
            round.enemy_distance,
          ]
        );
        game.push_game = pushResult.rows[0];
      }

      const srField = `${gameData.role.toLowerCase()}_sr`;
      const srAdjustment =
        gameData.result === "win" ? gameData.sr_change : -gameData.sr_change;
      await client.query(
        `UPDATE users SET ${srField} = ${srField} + $1 WHERE user_id = $2`,
        [srAdjustment, userId]
      );

      await client.query("COMMIT");
      return game;
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }
}

module.exports = new GameModel();

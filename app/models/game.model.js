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

  async getGamesByUser(userName, queries = {}) {
    const { season, role, map_name, result } = queries;
    let query = `
      SELECT 
        games.*,
        users.user_name,
        roles.role_name,
        maps.map_name
      FROM games
      JOIN users ON games.user_id = users.user_id
      JOIN roles ON games.role_id = roles.role_id
      JOIN maps ON games.map_id = maps.map_id
      WHERE LOWER(users.user_name) = LOWER($1)
    `;

    const queryParams = [userName];

    if (season !== undefined) {
      if (isNaN(season)) {
        throw AppError.badRequest("Bad request");
      }
      queryParams.push(season);
      query += ` AND games.season = $${queryParams.length}`;
    }

    if (role) {
      queryParams.push(role);
      query += ` AND LOWER(roles.role_name) = LOWER($${queryParams.length})`;
    }

    if (map_name) {
      queryParams.push(map_name);
      query += ` AND LOWER(maps.map_name) = LOWER($${queryParams.length})`;
    }

    if (result) {
      if (!["win", "loss"].includes(result.toLowerCase())) {
        throw AppError.badRequest("Bad request");
      }
      queryParams.push(result);
      query += ` AND LOWER(games.result) = LOWER($${queryParams.length})`;
    }

    const { rows } = await db.query(query, queryParams);

    if (!rows.length) {
      throw AppError.notFound("Not found");
    }

    return rows;
  }

  async getGameById(userName, gameId) {
    // Get base game data
    let query = `
      SELECT 
        games.*,
        users.user_name,
        roles.role_name,
        maps.map_name,
        maps.game_mode
      FROM games
      JOIN users ON games.user_id = users.user_id 
      JOIN roles ON games.role_id = roles.role_id
      JOIN maps ON games.map_id = maps.map_id
      WHERE LOWER(users.user_name) = LOWER($1)
      AND games.game_id = $2
    `;

    const { rows } = await db.query(query, [userName, gameId]);

    if (!rows.length) {
      throw AppError.notFound("Not found");
    }

    const game = rows[0];

    let modeSpecificData;
    switch (game.game_mode) {
      case "Clash": {
        const clashQuery = `
          SELECT 
            cg.*,
            h1.hero_name as hero_1_name,
            h2.hero_name as hero_2_name,
            h3.hero_name as hero_3_name
          FROM clash_games cg
          LEFT JOIN heroes h1 ON cg.hero_id_1 = h1.hero_id
          LEFT JOIN heroes h2 ON cg.hero_id_2 = h2.hero_id
          LEFT JOIN heroes h3 ON cg.hero_id_3 = h3.hero_id
          WHERE game_id = $1
        `;
        const { rows: clashRows } = await db.query(clashQuery, [gameId]);
        if (clashRows.length) {
          const heroNames = [
            clashRows[0].hero_1_name,
            clashRows[0].hero_2_name,
            clashRows[0].hero_3_name,
          ].filter(Boolean);
          modeSpecificData = {
            hero_names: heroNames,
            team_score: clashRows[0].team_score,
            enemy_score: clashRows[0].enemy_score,
          };
        }
        break;
      }
      case "Control": {
        const controlQuery = `
          SELECT 
            cg.*,
            h1.hero_name as hero_1_name,
            h2.hero_name as hero_2_name,
            h3.hero_name as hero_3_name
          FROM control_games cg
          LEFT JOIN heroes h1 ON cg.hero_id_1 = h1.hero_id
          LEFT JOIN heroes h2 ON cg.hero_id_2 = h2.hero_id
          LEFT JOIN heroes h3 ON cg.hero_id_3 = h3.hero_id
          WHERE game_id = $1
          ORDER BY round_number
        `;
        const { rows: controlRows } = await db.query(controlQuery, [gameId]);
        if (controlRows.length) {
          modeSpecificData = controlRows.map((round) => ({
            round_number: round.round_number,
            submap_name: round.submap_name,
            hero_names: [
              round.hero_1_name,
              round.hero_2_name,
              round.hero_3_name,
            ].filter(Boolean),
            team_score: round.team_score,
            enemy_score: round.enemy_score,
          }));
        }
        break;
      }
      case "Escort": {
        const escortQuery = `
          SELECT 
            eg.*,
            h1.hero_name as hero_1_name,
            h2.hero_name as hero_2_name,
            h3.hero_name as hero_3_name
          FROM escort_games eg
          LEFT JOIN heroes h1 ON eg.hero_id_1 = h1.hero_id
          LEFT JOIN heroes h2 ON eg.hero_id_2 = h2.hero_id
          LEFT JOIN heroes h3 ON eg.hero_id_3 = h3.hero_id
          WHERE game_id = $1
          ORDER BY round_number
        `;
        const { rows: escortRows } = await db.query(escortQuery, [gameId]);
        if (escortRows.length) {
          modeSpecificData = escortRows.map((round) => ({
            round_number: round.round_number,
            starting_side: round.starting_side,
            hero_names: [
              round.hero_1_name,
              round.hero_2_name,
              round.hero_3_name,
            ].filter(Boolean),
            score: round.score,
            sub_score: round.sub_score,
          }));
        }
        break;
      }
      case "Flashpoint": {
        const flashpointQuery = `
          SELECT 
            fg.*,
            h1.hero_name as hero_1_name,
            h2.hero_name as hero_2_name,
            h3.hero_name as hero_3_name
          FROM flashpoint_games fg
          LEFT JOIN heroes h1 ON fg.hero_id_1 = h1.hero_id
          LEFT JOIN heroes h2 ON fg.hero_id_2 = h2.hero_id
          LEFT JOIN heroes h3 ON fg.hero_id_3 = h3.hero_id
          WHERE game_id = $1
        `;
        const { rows: flashpointRows } = await db.query(flashpointQuery, [
          gameId,
        ]);
        if (flashpointRows.length) {
          const heroNames = [
            flashpointRows[0].hero_1_name,
            flashpointRows[0].hero_2_name,
            flashpointRows[0].hero_3_name,
          ].filter(Boolean);
          modeSpecificData = {
            hero_names: heroNames,
            team_score: flashpointRows[0].team_score,
            enemy_score: flashpointRows[0].enemy_score,
          };
        }
        break;
      }
      case "Hybrid": {
        const hybridQuery = `
          SELECT 
            hg.*,
            h1.hero_name as hero_1_name,
            h2.hero_name as hero_2_name,
            h3.hero_name as hero_3_name
          FROM hybrid_games hg
          LEFT JOIN heroes h1 ON hg.hero_id_1 = h1.hero_id
          LEFT JOIN heroes h2 ON hg.hero_id_2 = h2.hero_id
          LEFT JOIN heroes h3 ON hg.hero_id_3 = h3.hero_id
          WHERE game_id = $1
          ORDER BY round_number
        `;
        const { rows: hybridRows } = await db.query(hybridQuery, [gameId]);
        if (hybridRows.length) {
          modeSpecificData = hybridRows.map((round) => ({
            round_number: round.round_number,
            starting_side: round.starting_side,
            hero_names: [
              round.hero_1_name,
              round.hero_2_name,
              round.hero_3_name,
            ].filter(Boolean),
            score: round.score,
            sub_score: round.sub_score,
          }));
        }
        break;
      }
      case "Push": {
        const pushQuery = `
          SELECT 
            pg.*,
            h1.hero_name as hero_1_name,
            h2.hero_name as hero_2_name,
            h3.hero_name as hero_3_name
          FROM push_games pg
          LEFT JOIN heroes h1 ON pg.hero_id_1 = h1.hero_id
          LEFT JOIN heroes h2 ON pg.hero_id_2 = h2.hero_id
          LEFT JOIN heroes h3 ON pg.hero_id_3 = h3.hero_id
          WHERE game_id = $1
        `;
        const { rows: pushRows } = await db.query(pushQuery, [gameId]);
        if (pushRows.length) {
          const heroNames = [
            pushRows[0].hero_1_name,
            pushRows[0].hero_2_name,
            pushRows[0].hero_3_name,
          ].filter(Boolean);
          modeSpecificData = {
            hero_names: heroNames,
            team_score: pushRows[0].team_score,
            team_distance: pushRows[0].team_distance,
            enemy_score: pushRows[0].enemy_score,
            enemy_distance: pushRows[0].enemy_distance,
          };
        }
        break;
      }
    }

    return {
      ...game,
      mode_specific_data: modeSpecificData,
    };
  }
}

module.exports = new GameModel();

\c overwatch_tracker

\echo '\n All games:\n'
SELECT games.game_id, games.season, users.user_name, roles.role_name, maps.map_name, games.user_score, games.enemy_score, games.result
FROM games
JOIN users ON users.user_id = games.user_id
JOIN roles ON roles.role_id = games.role_id
JOIN maps ON maps.map_id = games.map_id;
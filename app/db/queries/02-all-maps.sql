\c overwatch_tracker

\echo '\n All maps with mode names:\n'
SELECT maps.map_name, game_modes.game_mode_name
FROM maps
LEFT JOIN game_modes ON maps.game_mode_id = game_modes.game_mode_id;
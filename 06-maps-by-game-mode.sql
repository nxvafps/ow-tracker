\c overwatch_tracker

\echo '\n All clash maps:\n'
SELECT maps.map_name, game_modes.game_mode_name
FROM maps
LEFT JOIN game_modes ON maps.game_mode_id = game_modes.game_mode_id
WHERE game_modes.game_mode_name = 'Clash';

\echo '\n All control maps:\n'
SELECT maps.map_name, game_modes.game_mode_name
FROM maps
LEFT JOIN game_modes ON maps.game_mode_id = game_modes.game_mode_id
WHERE game_modes.game_mode_name = 'Control';

\echo '\n All flashpoint maps:\n'
SELECT maps.map_name, game_modes.game_mode_name
FROM maps
LEFT JOIN game_modes ON maps.game_mode_id = game_modes.game_mode_id
WHERE game_modes.game_mode_name = 'Flashpoint';

\echo '\n All escort maps:\n'
SELECT maps.map_name, game_modes.game_mode_name
FROM maps
LEFT JOIN game_modes ON maps.game_mode_id = game_modes.game_mode_id
WHERE game_modes.game_mode_name = 'Escort';

\echo '\n All hybrid maps:\n'
SELECT maps.map_name, game_modes.game_mode_name
FROM maps
LEFT JOIN game_modes ON maps.game_mode_id = game_modes.game_mode_id
WHERE game_modes.game_mode_name = 'Hybrid';

\echo '\n All push maps:\n'
SELECT maps.map_name, game_modes.game_mode_name
FROM maps
LEFT JOIN game_modes ON maps.game_mode_id = game_modes.game_mode_id
WHERE game_modes.game_mode_name = 'Push';

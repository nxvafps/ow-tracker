\c overwatch_tracker

SELECT 
  games.game_id, 
  games.season, 
  users.user_name, 
  roles.role_name, 
  maps.map_name, 
  hero1.hero_name as hero_1,
  hero2.hero_name as hero_2,
  hero3.hero_name as hero_3,
  games.user_score, 
  games.enemy_score, 
  games.result, 
  games.sr_change
FROM games
JOIN users ON games.user_id = users.user_id
JOIN roles ON games.role_id = roles.role_id
JOIN maps ON games.map_id = maps.map_id
 JOIN clash_games ON clash_games.game_id = games.game_id
LEFT JOIN heroes hero1 ON clash_games.hero_id_1 = hero1.hero_id
LEFT JOIN heroes hero2 ON clash_games.hero_id_2 = hero2.hero_id
LEFT JOIN heroes hero3 ON clash_games.hero_id_3 = hero3.hero_id;

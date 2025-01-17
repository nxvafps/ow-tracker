DROP DATABASE IF EXISTS overwatch_tracker;
CREATE DATABASE overwatch_tracker;

\c overwatch_tracker

-- Create game mode table 

DROP TABLE IF EXISTS game_modes;

CREATE TABLE game_modes (
  game_mode_id SERIAL PRIMARY KEY,
  game_mode_name VARCHAR(15)
);

INSERT INTO game_modes
  (game_mode_name)
VALUES
  ('Clash'),
  ('Control'),
  ('Escort'),
  ('Flashpoint'),
  ('Hybrid'),
  ('Push');

-- Create map table

DROP TABLE IF EXISTS maps;

CREATE TABLE maps (
  map_id SERIAL PRIMARY KEY,
  map_name VARCHAR(40),
  game_mode_id INTEGER REFERENCES game_modes(game_mode_id)
);

INSERT INTO maps 
  (map_name, game_mode_id)
VALUES
  ('Antarctic Peninsula', 2),
  ('Blizzard World', 5),
  ('Busan', 2),
  ('Circuit Royale', 3),
  ('Colosseo', 6),
  ('Dorado', 3),
  ('Eichenwalde', 5),
  ('Esperanca', 6),
  ('Hanaoka', 1),
  ('Havana', 3),
  ('Hollywood', 5),
  ('Illios', 2),
  ('Junkertown', 3),
  ('King''s Row', 5),
  ('Lijiang Tower', 2),
  ('Midtown', 5),
  ('Nepal', 2),
  ('New Junk City', 4),
  ('New Queen Street', 6),
  ('Numbani', 5),
  ('Oasis', 2),
  ('Paraiso', 5),
  ('Rialto', 3),
  ('Route 66', 3),
  ('Runasapi', 6),
  ('Samoa', 2),
  ('Shambali Monastary', 3),
  ('Suravasa', 4),
  ('Throne of Annubis', 1),
  ('Watchpoint: Gibraltar', 3);

-- Create roles table

DROP TABLE IF EXISTS roles;

CREATE TABLE roles (
  role_id SERIAL PRIMARY KEY,
  role_name VARCHAR(7)
);

INSERT INTO roles
  (role_name)
VALUES
  ('DPS'),
  ('Support'),
  ('Tank');

-- Create heroes table

DROP TABLE IF EXISTS heroes;

CREATE TABLE heroes (
  hero_id SERIAL PRIMARY KEY,
  hero_name VARCHAR(40) NOT NULL,
  role_id INTEGER REFERENCES roles(role_id)
);

INSERT INTO heroes 
  (hero_name, role_id)
VALUES
  ('Ana', 2),
  ('Ashe', 1),
  ('Baptiste', 2),
  ('Bastion', 1),
  ('Brigitte', 2),
  ('Cassidy', 1),
  ('D.VA', 3),
  ('Doomfist', 3),
  ('Echo', 1),
  ('Genji', 1),
  ('Hanzo', 1),
  ('Hazard', 3),
  ('Illari', 2),
  ('Junker Queen', 3),
  ('Junkrat', 1),
  ('Juno', 2),
  ('Kiriko', 2),
  ('Lifeweaver', 2),
  ('Lucio', 2),
  ('Mauga', 3),
  ('Mei', 1),
  ('Mercy', 2),
  ('Moira', 2),
  ('Orisa', 3),
  ('Pharah', 1),
  ('Ramattra', 3),
  ('Reaper', 1),
  ('Reinhardt', 3),
  ('Roadhog', 3),
  ('Sigma', 3),
  ('Sojourn', 1),
  ('Soldier: 76', 1),
  ('Sombra', 1),
  ('Symmetra', 1),
  ('Torbjorn', 1),
  ('Tracer', 1),
  ('Venture', 1),
  ('Widowmaker', 1),
  ('Winston', 3),
  ('Wrecking Ball', 3),
  ('Zarya', 3),
  ('Zenyatta', 2);

-- Create users table

DROP TABLE IF EXISTS users;

CREATE TABLE users (
  user_id SERIAL PRIMARY KEY,
  user_name VARCHAR(15) NOT NULL,
  user_main_role INTEGER REFERENCES roles(role_id),
  user_main_hero INTEGER REFERENCES heroes(hero_id),
  dps_sr INTEGER,
  support_sr INTEGER,
  tank_sr INTEGER
);

INSERT INTO users
  (user_name, user_main_role, user_main_hero)
VALUES
  ('nova', 1, 9),
  ('omby', 2, 17);

-- Create games table

DROP TABLE IF EXISTS games;

CREATE TABLE games (
  game_id SERIAL PRIMARY KEY,
  season INTEGER NOT NULL,
  user_id INTEGER REFERENCES users(user_id) NOT NULL,
  role_id INTEGER REFERENCES roles(role_id) NOT NULL,
  map_id INTEGER REFERENCES maps(map_id) NOT NULL,
  user_score INTEGER NOT NULL,
  enemy_score INTEGER NOT NULL,
  result VARCHAR(4)
);

INSERT INTO games
  (season, user_id, role_id, map_id, user_score, enemy_score, result)
VALUES
  (14, 1, 1, 9, 5, 4, 'win'), --hanaoka
  (14, 2, 2, 1, 2 ,0, 'win'), --peninsula
  (14, 1, 1, 18, 2, 3, 'loss'), --new junk city
  (14, 2, 2, 4, 0, 2, 'loss'), --circuit
  (14, 1, 1, 20, 2, 1, 'win'), --numbani
  (14, 2, 2, 5, 1, 0,'win'); --colosseo

  --need to add tables for each game mode

  DROP TABLE IF EXISTS clash_games;
  DROP TABLE IF EXISTS control_games;
  DROP TABLE IF EXISTS escort_games;
  DROP TABLE IF EXISTS flashpoint_games;
  DROP TABLE IF EXISTS hybrid_games;
  DROP TABLE IF EXISTS push_games;
DROP DATABASE IF EXISTS overwatch_tracker;
CREATE DATABASE overwatch_tracker;

\c overwatch_tracker

DROP TABLE IF EXISTS control_games;
DROP TABLE IF EXISTS escort_games;
DROP TABLE IF EXISTS flashpoint_games;
DROP TABLE IF EXISTS hybrid_games;
DROP TABLE IF EXISTS push_games;
DROP TABLE IF EXISTS clash_games;
DROP TABLE IF EXISTS games;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS heroes;
DROP TABLE IF EXISTS roles;
DROP TABLE IF EXISTS push_details;
DROP TABLE IF EXISTS escort_details;
DROP TABLE IF EXISTS hybrid_details;
DROP TABLE IF EXISTS control_submaps;
DROP TABLE IF EXISTS maps;
DROP TABLE IF EXISTS game_modes;


-- Create game mode table

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

-- TODO: add data to the below tables
-- Control submaps table (contains all submaps)

CREATE TABLE control_submaps (
  submap_id SERIAL PRIMARY KEY,
  map_id INTEGER REFERENCES maps(map_id),
  submap_name VARCHAR(40)
);

INSERT INTO control_submaps
  (map_id, submap_name)
VALUES
  (26, 'Beach'),
  (21, 'City Center'),
  (15, 'Control Center'),
  (3, 'Downtown'),
  (26, 'Downtown'),
  (15, 'Garden'),
  (21, 'Gardens'),
  (1, 'Icebreaker'),
  (1, 'Labs'),
  (12, 'Lighthouse'),
  (3, 'Meka Base'),
  (15, 'Night Market'),
  (12, 'Ruins'),
  (3, 'Sanctuary'),
  (17, 'Sanctum'),
  (17, 'Shrine'),
  (1, 'Sublevel'),
  (21, 'University'),
  (17, 'Village'),
  (26, 'Volcano'),
  (12, 'Well');

-- Hybrid details (contains all hybrid maps)

CREATE TABLE hybrid_details (
  hybrid_details_id SERIAL PRIMARY KEY,
  map_id INTEGER REFERENCES maps(map_id),
  distance_1 NUMERIC,
  distance_2 NUMERIC
);

INSERT INTO hybrid_details 
  (map_id, distance_1, distance_2)
VALUES
  (2, 113.67, 111.54),
  (7, 128.10, 67.63),
  (11, 119.10, 79.02),
  (14, 114.67, 70.24),
  (16, 113.46, 95.26),
  (20, 96.88, 71.71),
  (22, 123.73, 92.38);

-- Escort details (contains all escort maps)

CREATE TABLE escort_details (
  escort_details_id SERIAL PRIMARY KEY,
  map_id INTEGER REFERENCES maps(map_id),
  distance_1 NUMERIC,
  distance_2 NUMERIC,
  distance_3 NUMERIC
);

INSERT INTO escort_details
  (map_id, distance_1, distance_2, distance_3)
VALUES
  (4, 96.59, 90.83, 93.94),
  (6, 84.99, 96.22, 85.87),
  (10, 89.33, 92.73, 103.31),
  (13, 90.92, 86.55, 101.88),
  (23, 90.08, 104.64, 88.03),
  (24, 84.77, 91.25, 74.57),
  (27, 104.13, 104.61, 87.13),
  (30, 86.05, 82.28, 88.72);

-- Push details (contains all push maps

CREATE TABLE push_details (
  push_details_id SERIAL PRIMARY KEY,
  map_id INTEGER REFERENCES maps(map_id),
  distance_1 NUMERIC,
  distance_2 NUMERIC
);

INSERT INTO push_details
  (map_id, distance_1, distance_2)
VALUES
  (5, 66.42, 73.07),
  (8, 53.55, 88.86),
  (19, 57.18, 70.93),
  (25, 55.53, 89.32);

-- Create roles table

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
  ('D.va', 3),
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

CREATE TABLE games (
  game_id SERIAL PRIMARY KEY,
  season INTEGER NOT NULL,
  user_id INTEGER REFERENCES users(user_id) NOT NULL,
  role_id INTEGER REFERENCES roles(role_id) NOT NULL,
  map_id INTEGER REFERENCES maps(map_id) NOT NULL,
  user_score INTEGER NOT NULL,
  enemy_score INTEGER NOT NULL,
  result VARCHAR(4) NOT NULL,
  sr_change INTEGER NOT NULL
);

INSERT INTO games
  (season, user_id, role_id, map_id, user_score, enemy_score, result, sr_change)
VALUES
  (14, 1, 1, 9, 5, 4, 'win', 20), --hanaoka
  (14, 2, 2, 1, 2 ,0, 'win', 20), --peninsula
  (14, 1, 1, 18, 2, 3, 'loss', 20), --new junk city
  (14, 2, 2, 4, 0, 2, 'loss', 20), --circuit
  (14, 1, 1, 20, 2, 1, 'win', 20), --numbani
  (14, 2, 2, 5, 1, 0,'win', 20); --colosseo

  --need to add tables for each game mode

CREATE TABLE clash_games (
  clash_game_id SERIAL PRIMARY KEY,
  game_id INTEGER REFERENCES games(game_id),
  hero_id_1 INTEGER REFERENCES heroes(hero_id) NOT NULL,
  hero_id_2 INTEGER REFERENCES heroes(hero_id),
  hero_id_3 INTEGER REFERENCES heroes(hero_id),
  team_score INTEGER NOT NULL,
  enemy_score INTEGER NOT NULL
);

INSERT INTO clash_games 
  (game_id, hero_id_1, hero_id_2, hero_id_3, team_score, enemy_score)
VALUES
  (1, 9, null, null, 5, 4);
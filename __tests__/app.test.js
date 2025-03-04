const request = require("supertest");
const app = require("../app/app");
const runSeed = require("../app/db/run-seed");
const db = require("../app/db");

beforeEach(async () => {
  await runSeed();
});
afterAll(() => {
  db.end();
});

describe("invalid route", () => {
  it("should respond with a status code of 404 when given an invalid route", async () => {
    const {
      body: { message },
    } = await request(app).get("/api/invalid").expect(404);
    expect(message).toBe(`Can't find /api/invalid on this server`);
  });
});

describe("/api", () => {
  describe("/healthcheck", () => {
    describe("GET", () => {
      it("should return a status code of 200", () => {
        return request(app).get("/api/healthcheck").expect(200);
      });
    });
  });

  describe("/heroes", () => {
    describe("GET", () => {
      test("200: responds with an array of heroes", async () => {
        const { body } = await request(app).get("/api/heroes").expect(200);

        expect(body).toHaveProperty("heroes");
        expect(Array.isArray(body.heroes)).toBe(true);
        expect(body.heroes.length).toBeGreaterThan(0);
        body.heroes.forEach((hero) => {
          expect(hero).toMatchObject({
            hero_name: expect.any(String),
            role_name: expect.any(String),
          });
        });
      });
    });

    describe("GET (queries)", () => {
      describe("role queries", () => {
        test("200: responds with an array of DPS heroes", async () => {
          const { body } = await request(app)
            .get("/api/heroes?role=dps")
            .expect(200);

          expect(body).toHaveProperty("heroes");
          expect(Array.isArray(body.heroes)).toBe(true);
          expect(body.heroes.length).toBeGreaterThan(0);
          body.heroes.forEach((hero) => {
            expect(hero).toMatchObject({
              hero_name: expect.any(String),
              role_name: "DPS",
            });
          });
        });

        test("200: responds with an array of support heroes", async () => {
          const { body } = await request(app)
            .get("/api/heroes?role=support")
            .expect(200);

          expect(body).toHaveProperty("heroes");
          expect(Array.isArray(body.heroes)).toBe(true);
          expect(body.heroes.length).toBeGreaterThan(0);
          body.heroes.forEach((hero) => {
            expect(hero).toMatchObject({
              hero_name: expect.any(String),
              role_name: "Support",
            });
          });
        });

        test("200: responds with an array of tank heroes", async () => {
          const { body } = await request(app)
            .get("/api/heroes?role=tank")
            .expect(200);

          expect(body).toHaveProperty("heroes");
          expect(Array.isArray(body.heroes)).toBe(true);
          expect(body.heroes.length).toBeGreaterThan(0);
          body.heroes.forEach((hero) => {
            expect(hero).toMatchObject({
              hero_name: expect.any(String),
              role_name: "Tank",
            });
          });
        });

        test("404: responds with error message when given invalid role", async () => {
          const {
            body: { message },
          } = await request(app).get("/api/heroes?role=invalid").expect(404);

          expect(message).toBe("No heroes found with role: invalid");
        });

        test("400: responds with error message when given invalid data type", async () => {
          const {
            body: { message },
          } = await request(app).get("/api/heroes?role=123").expect(400);

          expect(message).toEqual("Invalid input: role must be a string");
        });
      });
      describe("order queries", () => {
        test("200: responds with heroes sorted by hero_id in ascending order", async () => {
          const { body } = await request(app)
            .get("/api/heroes?order=asc")
            .expect(200);

          expect(body).toHaveProperty("heroes");
          expect(Array.isArray(body.heroes)).toBe(true);
          expect(body.heroes.length).toBeGreaterThan(0);

          // Check if heroes are in ascending order
          const heroNames = body.heroes.map((hero) => hero.hero_name);
          expect(heroNames).toBeSorted();
        });

        test("200: responds with heroes sorted by hero_id in descending order", async () => {
          const { body } = await request(app)
            .get("/api/heroes?order=desc")
            .expect(200);

          expect(body).toHaveProperty("heroes");
          expect(Array.isArray(body.heroes)).toBe(true);
          expect(body.heroes.length).toBeGreaterThan(0);

          // Check if heroes are in descending order
          const heroNames = body.heroes.map((hero) => hero.hero_name);
          expect(heroNames).toBeSorted({ descending: true });
        });

        test("400: responds with error when given invalid order value", async () => {
          const { body } = await request(app)
            .get("/api/heroes?order=invalid")
            .expect(400);

          expect(body.message).toBe(
            "Invalid order query - must be 'asc' or 'desc'"
          );
        });
      });
    });

    describe("/api/heroes/:hero_name", () => {
      describe("GET", () => {
        test("200: responds with a singular hero", async () => {
          const { body } = await request(app)
            .get("/api/heroes/ana")
            .expect(200);

          expect(body).toHaveProperty("hero");
          expect(Array.isArray(body.hero)).toBe(true);
          expect(body.hero.length).toBe(1);
          expect(body.hero[0]).toMatchObject({
            hero_name: "Ana",
            role_name: "Support",
          });
        });
      });
    });
  });

  describe("/maps", () => {
    describe("GET", () => {
      test("200: responds with an array of maps", async () => {
        const { body } = await request(app).get("/api/maps").expect(200);

        expect(body).toHaveProperty("maps");
        expect(Array.isArray(body.maps)).toBe(true);
        expect(body.maps.length).toBeGreaterThan(0);
        body.maps.forEach((map) => {
          expect(map).toMatchObject({
            map: expect.any(String),
            game_mode: expect.any(String),
            submaps: expect.toBeOneOf([expect.any(Object), null]),
            distances: expect.toBeOneOf([
              {
                distance1: expect.any(Number),
                distance2: expect.any(Number),
                distance3: expect.any(Number),
              },
              {
                distance1: expect.any(Number),
                distance2: expect.any(Number),
              },
              null,
            ]),
          });
        });
      });
    });
    describe("GET (queries)", () => {
      describe("game_mode queries", () => {
        test("200: responds with array of Control maps", async () => {
          const { body } = await request(app)
            .get("/api/maps?game_mode=control")
            .expect(200);

          expect(body.maps).toBeInstanceOf(Array);
          expect(body.maps.length).toBeGreaterThan(0);
          body.maps.forEach((map) => {
            expect(map.game_mode).toBe("Control");
            expect(map.submaps).toEqual(expect.any(Object));
            expect(map.distances).toBeNull();
          });
        });

        test("200: responds with array of Escort maps", async () => {
          const { body } = await request(app)
            .get("/api/maps?game_mode=escort")
            .expect(200);

          expect(body.maps).toBeInstanceOf(Array);
          expect(body.maps.length).toBeGreaterThan(0);
          body.maps.forEach((map) => {
            expect(map.game_mode).toBe("Escort");
            expect(map.submaps).toBeNull();
            expect(map.distances).toMatchObject({
              distance1: expect.any(Number),
              distance2: expect.any(Number),
              distance3: expect.any(Number),
            });
          });
        });

        test("200: responds with array of Push maps", async () => {
          const { body } = await request(app)
            .get("/api/maps?game_mode=push")
            .expect(200);

          expect(body.maps).toBeInstanceOf(Array);
          expect(body.maps.length).toBeGreaterThan(0);
          body.maps.forEach((map) => {
            expect(map.game_mode).toBe("Push");
            expect(map.submaps).toBeNull();
            expect(map.distances).toMatchObject({
              distance1: expect.any(Number),
              distance2: expect.any(Number),
            });
          });
        });

        test("404: responds with error for invalid game mode", async () => {
          const { body } = await request(app)
            .get("/api/maps?game_mode=invalid")
            .expect(404);

          expect(body.message).toBe("Not found");
        });
      });

      describe("sort queries", () => {
        test("200: responds with maps sorted by name ASC", async () => {
          const { body } = await request(app)
            .get("/api/maps?sort=asc")
            .expect(200);

          const mapNames = body.maps.map((map) => map.map);
          expect(mapNames).toBeSorted();
        });

        test("200: responds with maps sorted by name DESC", async () => {
          const { body } = await request(app)
            .get("/api/maps?sort=desc")
            .expect(200);

          const mapNames = body.maps.map((map) => map.map);
          expect(mapNames).toBeSorted({ descending: true });
        });

        test("400: responds with error for invalid sort value", async () => {
          const { body } = await request(app)
            .get("/api/maps?sort=invalid")
            .expect(400);

          expect(body.message).toBe("Bad request");
        });
      });

      describe("has_submaps queries", () => {
        test("200: responds with only maps that have submaps", async () => {
          const { body } = await request(app)
            .get("/api/maps?has_submaps=true")
            .expect(200);

          expect(body.maps.length).toBeGreaterThan(0);
          body.maps.forEach((map) => {
            expect(map.submaps).toEqual(expect.any(Object));
          });
        });

        test("200: responds with only maps that don't have submaps", async () => {
          const { body } = await request(app)
            .get("/api/maps?has_submaps=false")
            .expect(200);

          expect(body.maps.length).toBeGreaterThan(0);
          body.maps.forEach((map) => {
            expect(map.submaps).toBeNull();
          });
        });

        test("400: responds with error for invalid has_submaps value", async () => {
          const { body } = await request(app)
            .get("/api/maps?has_submaps=invalid")
            .expect(400);

          expect(body.message).toBe("Bad request");
        });
      });
    });

    describe("/:map_name", () => {
      describe("GET", () => {
        test("200: responds with a specific map", async () => {
          const { body } = await request(app)
            .get("/api/maps/antarctic-peninsula")
            .expect(200);

          expect(body).toHaveProperty("map");
          expect(Array.isArray(body.map)).toBe(true);
          expect(body.map.length).toBe(1);
          expect(body.map[0]).toMatchObject({
            map: "Antarctic Peninsula",
            game_mode: "Control",
            submaps: {
              submap1: "Icebreaker",
              submap2: "Labs",
              submap3: "Sublevel",
            },
            distances: null,
          });
        });

        test("200: responds with map when name contains spaces", async () => {
          const { body } = await request(app)
            .get("/api/maps/kings-row")
            .expect(200);

          expect(body.map[0]).toMatchObject({
            map: "King's Row",
            game_mode: "Hybrid",
            submaps: null,
            distances: {
              distance1: expect.any(Number),
              distance2: expect.any(Number),
            },
          });
        });

        test("404: responds with error when map does not exist", async () => {
          const { body } = await request(app)
            .get("/api/maps/not-a-real-map")
            .expect(404);

          expect(body.message).toBe("Not found");
        });
      });
    });
  });
  describe("/users", () => {
    describe("GET", () => {
      test("200: should successfully return all users", async () => {
        const { body } = await request(app).get("/api/users").expect(200);

        expect(body).toHaveProperty("users");
        expect(Array.isArray(body.users)).toBe(true);
        expect(body.users.length).toBe(7);

        body.users.forEach((user) => {
          expect(user).toMatchObject({
            user_name: expect.any(String),
            user_main_role: expect.any(String),
            user_main_hero: expect.any(String),
            dps_sr: expect.toBeOneOf([expect.any(Number), null]),
            support_sr: expect.toBeOneOf([expect.any(Number), null]),
            tank_sr: expect.toBeOneOf([expect.any(Number), null]),
          });
        });
      });
    });
    describe("POST", () => {
      test("201: should successfully create a new user", async () => {
        const newUser = {
          user_name: "testUser",
          user_main_role: "Tank",
          user_main_hero: "D.va",
          dps_sr: null,
          support_sr: 2100,
          tank_sr: 2800,
        };

        const { body } = await request(app)
          .post("/api/users")
          .send(newUser)
          .expect(201);

        expect(body.user).toMatchObject({
          user_name: "testUser",
          user_main_role: "Tank",
          user_main_hero: "D.va",
          dps_sr: null,
          support_sr: 2100,
          tank_sr: 2800,
        });
      });

      test("400: fails when missing required properties", async () => {
        const invalidUser = {
          user_name: "testUser",
          dps_sr: 2500,
        };

        const { body } = await request(app)
          .post("/api/users")
          .send(invalidUser)
          .expect(400);

        expect(body.message).toBe("Bad request");
      });

      test("400: fails when SR value is invalid", async () => {
        const invalidUser = {
          user_name: "testUser",
          user_main_role: "DPS",
          user_main_hero: "Echo",
          dps_sr: 5000,
        };

        const { body } = await request(app)
          .post("/api/users")
          .send(invalidUser)
          .expect(400);

        expect(body.message).toBe("Bad request");
      });

      test("400: fails when role or hero doesn't exist", async () => {
        const invalidUser = {
          user_name: "testUser",
          user_main_role: "InvalidRole",
          user_main_hero: "InvalidHero",
          dps_sr: 2500,
        };

        const { body } = await request(app)
          .post("/api/users")
          .send(invalidUser)
          .expect(400);

        expect(body.message).toBe("Bad request");
      });
    });
    describe("/:username", () => {
      describe("GET", () => {
        test("200: responds with the requested user", async () => {
          const { body } = await request(app)
            .get("/api/users/nova")
            .expect(200);

          expect(body).toHaveProperty("user");
          expect(body.user).toMatchObject({
            user_name: "nova",
            user_main_role: "DPS",
            user_main_hero: "Echo",
            dps_sr: 2500,
            support_sr: null,
            tank_sr: null,
          });
        });

        test("404: responds with error when username does not exist", async () => {
          const { body } = await request(app)
            .get("/api/users/nonexistent")
            .expect(404);

          expect(body.message).toBe("Not found");
        });
      });
      describe("PATCH", () => {
        test("200: should update user's SR for a specific role", async () => {
          const updateData = {
            dps_sr: 2600,
            support_sr: null,
            tank_sr: 3000,
          };

          const { body } = await request(app)
            .patch("/api/users/nova")
            .send(updateData)
            .expect(200);

          expect(body.user).toMatchObject({
            user_name: "nova",
            user_main_role: "DPS",
            user_main_hero: "Echo",
            dps_sr: 2600,
            support_sr: null,
            tank_sr: 3000,
          });
        });

        test("400: responds with error when given invalid SR value", async () => {
          const invalidUpdate = {
            dps_sr: "not a number",
          };

          const { body } = await request(app)
            .patch("/api/users/nova")
            .send(invalidUpdate)
            .expect(400);

          expect(body.message).toBe("Bad request");
        });

        test("400: responds with error when SR is out of valid range", async () => {
          const invalidUpdate = {
            dps_sr: 5000,
          };

          const { body } = await request(app)
            .patch("/api/users/nova")
            .send(invalidUpdate)
            .expect(400);

          expect(body.message).toBe("Bad request");
        });

        test("404: responds with error when user does not exist", async () => {
          const updateData = {
            dps_sr: 2600,
          };

          const { body } = await request(app)
            .patch("/api/users/nonexistent")
            .send(updateData)
            .expect(404);

          expect(body.message).toBe("Not found");
        });
      });
    });
  });
  describe("/games", () => {
    describe("POST", () => {
      test("201: should successfully post a clash game and return the posted game", async () => {
        const newGame = {
          season: 14,
          user_name: "omby",
          role: "Support",
          map: "Throne of Annubis",
          mode: "Clash",
          rounds: [
            {
              hero_1_name: "Kiriko",
              hero_2_name: "Illari",
              hero_3_name: null,
              team_score: 2,
              enemy_score: 5,
            },
          ],
          team_score: 2,
          enemy_score: 5,
          result: "loss",
          sr_change: 23,
        };

        const { body } = await request(app)
          .post("/api/games")
          .send(newGame)
          .expect(201);

        expect(body.game).toMatchObject({
          game_id: expect.any(Number),
          season: 14,
          user_id: expect.any(Number),
          role_id: expect.any(Number),
          map_id: expect.any(Number),
          team_score: 2,
          enemy_score: 5,
          result: "loss",
          sr_change: 23,
        });

        expect(body.game.clash_game).toMatchObject({
          clash_game_id: expect.any(Number),
          game_id: body.game.game_id,
          hero_id_1: expect.any(Number),
          hero_id_2: expect.any(Number),
          hero_id_3: null,
          team_score: 2,
          enemy_score: 5,
        });

        const { body: userBody } = await request(app)
          .get("/api/users/omby")
          .expect(200);

        expect(userBody.user.support_sr).toBe(1477); // 1500 - 23
      });

      test("201: should successfully post a control game and return the posted game with rounds", async () => {
        const newGame = {
          season: 14,
          user_name: "nova",
          role: "DPS",
          map: "Illios",
          mode: "Control",
          rounds: [
            {
              round_number: 1,
              submap_name: "Well",
              hero_1_name: "Echo",
              hero_2_name: "Tracer",
              hero_3_name: null,
              team_score: 100,
              enemy_score: 27,
            },
            {
              round_number: 2,
              submap_name: "Ruins",
              hero_1_name: "Tracer",
              hero_2_name: null,
              hero_3_name: null,
              team_score: 100,
              enemy_score: 0,
            },
          ],
          team_score: 2,
          enemy_score: 0,
          result: "win",
          sr_change: 20,
        };

        const { body } = await request(app)
          .post("/api/games")
          .send(newGame)
          .expect(201);

        expect(body.game).toMatchObject({
          game_id: expect.any(Number),
          season: 14,
          user_id: expect.any(Number),
          role_id: expect.any(Number),
          map_id: expect.any(Number),
          team_score: 2,
          enemy_score: 0,
          result: "win",
          sr_change: 20,
        });

        expect(Array.isArray(body.game.control_game)).toBe(true);
        expect(body.game.control_game).toHaveLength(2);

        body.game.control_game.forEach((round, index) => {
          expect(round).toMatchObject({
            control_game_id: expect.any(Number),
            game_id: body.game.game_id,
            round_number: index + 1,
            submap_name: newGame.rounds[index].submap_name,
            hero_id_1: expect.any(Number),
            hero_id_2: index === 0 ? expect.any(Number) : null,
            hero_id_3: null,
            team_score: newGame.rounds[index].team_score,
            enemy_score: newGame.rounds[index].enemy_score,
          });
        });

        const { body: userBody } = await request(app)
          .get("/api/users/nova")
          .expect(200);

        expect(userBody.user.dps_sr).toBe(2520);
      });

      test("201: should successfully post an escort game and return the posted game with rounds", async () => {
        const newGame = {
          season: 14,
          user_name: "nova",
          role: "DPS",
          map: "Circuit Royale",
          mode: "Escort",
          rounds: [
            {
              round_number: 1,
              starting_side: "Attack",
              hero_1_name: "Widowmaker",
              hero_2_name: null,
              hero_3_name: null,
              score: 3,
              sub_score: "2:36",
            },
            {
              round_number: 2,
              starting_side: "Defend",
              hero_1_name: "Echo",
              hero_2_name: null,
              hero_3_name: null,
              score: 2,
              sub_score: 57.52,
            },
          ],
          team_score: 3,
          enemy_score: 2,
          result: "win",
          sr_change: 20,
        };

        const { body } = await request(app)
          .post("/api/games")
          .send(newGame)
          .expect(201);

        expect(body.game).toMatchObject({
          game_id: expect.any(Number),
          season: 14,
          user_id: expect.any(Number),
          role_id: expect.any(Number),
          map_id: expect.any(Number),
          team_score: 3,
          enemy_score: 2,
          result: "win",
          sr_change: 20,
        });

        expect(Array.isArray(body.game.escort_game)).toBe(true);
        expect(body.game.escort_game).toHaveLength(2);

        body.game.escort_game.forEach((round, index) => {
          expect(round).toMatchObject({
            escort_game_id: expect.any(Number),
            game_id: body.game.game_id,
            round_number: index + 1,
            starting_side: newGame.rounds[index].starting_side,
            hero_id_1: expect.any(Number),
            hero_id_2: null,
            hero_id_3: null,
            score: newGame.rounds[index].score,
            sub_score: newGame.rounds[index].sub_score.toString(),
          });
        });

        const { body: userBody } = await request(app)
          .get("/api/users/nova")
          .expect(200);

        expect(userBody.user.dps_sr).toBe(2520);
      });

      test("201: should successfully post a flashpoint game and return the posted game", async () => {
        const newGame = {
          season: 14,
          user_name: "nova",
          role: "DPS",
          map: "Suravasa",
          mode: "Flashpoint",
          rounds: [
            {
              hero_1_name: "Echo",
              hero_2_name: "Tracer",
              hero_3_name: null,
              team_score: 3,
              enemy_score: 1,
            },
          ],
          team_score: 3,
          enemy_score: 1,
          result: "win",
          sr_change: 20,
        };

        const { body } = await request(app)
          .post("/api/games")
          .send(newGame)
          .expect(201);

        expect(body.game).toMatchObject({
          game_id: expect.any(Number),
          season: 14,
          user_id: expect.any(Number),
          role_id: expect.any(Number),
          map_id: expect.any(Number),
          team_score: 3,
          enemy_score: 1,
          result: "win",
          sr_change: 20,
        });

        expect(body.game.flashpoint_game).toMatchObject({
          flashpoint_game_id: expect.any(Number),
          game_id: body.game.game_id,
          hero_id_1: expect.any(Number),
          hero_id_2: expect.any(Number),
          hero_id_3: null,
          team_score: 3,
          enemy_score: 1,
        });

        // Verify SR change was applied
        const { body: userBody } = await request(app)
          .get("/api/users/nova")
          .expect(200);

        expect(userBody.user.dps_sr).toBe(2520); // 2500 + 20
      });

      test("201: should successfully post a hybrid game and return the posted game with rounds", async () => {
        const newGame = {
          season: 14,
          user_name: "omby",
          role: "Support",
          map: "Numbani",
          mode: "Hybrid",
          rounds: [
            {
              round_number: 1,
              starting_side: "Attack",
              hero_1_name: "Kiriko",
              hero_2_name: null,
              hero_3_name: null,
              score: 3,
              sub_score: "1:32",
            },
            {
              round_number: 2,
              starting_side: "Defend",
              hero_1_name: "Zenyatta",
              hero_2_name: null,
              hero_3_name: null,
              score: 3,
              sub_score: "3:42",
            },
            {
              round_number: 3,
              starting_side: "Attack",
              hero_1_name: "Kiriko",
              hero_2_name: null,
              hero_3_name: null,
              score: 0,
              sub_score: 42.52,
            },
            {
              round_number: 4,
              starting_side: "Defend",
              hero_1_name: "Zenyatta",
              hero_2_name: null,
              hero_3_name: null,
              score: 1,
              sub_score: 42.53,
            },
          ],
          team_score: 3,
          enemy_score: 4,
          result: "loss",
          sr_change: 20,
        };

        const { body } = await request(app)
          .post("/api/games")
          .send(newGame)
          .expect(201);

        expect(body.game).toMatchObject({
          game_id: expect.any(Number),
          season: 14,
          user_id: expect.any(Number),
          role_id: expect.any(Number),
          map_id: expect.any(Number),
          team_score: 3,
          enemy_score: 4,
          result: "loss",
          sr_change: 20,
        });

        expect(Array.isArray(body.game.hybrid_game)).toBe(true);
        expect(body.game.hybrid_game).toHaveLength(4);

        body.game.hybrid_game.forEach((round, index) => {
          expect(round).toMatchObject({
            hybrid_game_id: expect.any(Number),
            game_id: expect.any(Number),
            round_number: index + 1,
            starting_side: newGame.rounds[index].starting_side,
            hero_id_1: expect.any(Number),
            hero_id_2: null,
            hero_id_3: null,
            score: newGame.rounds[index].score,
            sub_score: newGame.rounds[index].sub_score.toString(),
          });
        });

        // Verify SR change was applied
        const { body: userBody } = await request(app)
          .get("/api/users/omby")
          .expect(200);

        expect(userBody.user.support_sr).toBe(1480); // 1500 - 20
      });

      test("201: should successfully post a push game and return the posted game", async () => {
        const newGame = {
          season: 14,
          user_name: "nova",
          role: "DPS",
          map: "Colosseo",
          mode: "Push",
          rounds: [
            {
              hero_1_name: "Echo",
              hero_2_name: "Tracer",
              hero_3_name: null,
              team_score: 1,
              team_distance: 100.35,
              enemy_score: 0,
              enemy_distance: 70.48,
            },
          ],
          team_score: 1,
          enemy_score: 0,
          result: "win",
          sr_change: 20,
        };

        const { body } = await request(app)
          .post("/api/games")
          .send(newGame)
          .expect(201);

        expect(body.game).toMatchObject({
          game_id: expect.any(Number),
          season: 14,
          user_id: expect.any(Number),
          role_id: expect.any(Number),
          map_id: expect.any(Number),
          team_score: 1,
          enemy_score: 0,
          result: "win",
          sr_change: 20,
        });

        expect(body.game.push_game).toMatchObject({
          push_game_id: expect.any(Number),
          game_id: body.game.game_id,
          hero_id_1: expect.any(Number),
          hero_id_2: expect.any(Number),
          hero_id_3: null,
          team_score: 1,
          team_distance: "100.35",
          enemy_score: 0,
          enemy_distance: "70.48",
        });

        const { body: userBody } = await request(app)
          .get("/api/users/nova")
          .expect(200);

        expect(userBody.user.dps_sr).toBe(2520); // 2500 + 20
      });

      test("400: responds with error when missing required fields", async () => {
        const invalidGame = {
          season: 14,
          role: "Support",
          map: "Throne of Annubis",
          mode: "Clash",
          rounds: [
            {
              hero_1_name: "Kiriko",
              team_score: 2,
              enemy_score: 5,
            },
          ],
        };

        const { body } = await request(app)
          .post("/api/games")
          .send(invalidGame)
          .expect(400);

        expect(body.message).toBe("Bad request");
      });

      test("404: responds with error when user does not exist", async () => {
        const gameWithInvalidUser = {
          season: 14,
          user_name: "nonexistent_user",
          role: "Support",
          map: "Throne of Annubis",
          mode: "Clash",
          rounds: [
            {
              hero_1_name: "Kiriko",
              hero_2_name: "Illari",
              hero_3_name: null,
              team_score: 2,
              enemy_score: 5,
            },
          ],
          team_score: 2,
          enemy_score: 5,
          result: "loss",
          sr_change: 23,
        };

        const { body } = await request(app)
          .post("/api/games")
          .send(gameWithInvalidUser)
          .expect(404);

        expect(body.message).toBe("Not found");
      });
    });
    describe("/:user_name", () => {
      //add endpoint for :user_name/game_id too
      beforeEach(async () => {
        const testGames = require("../app/db/data/test-data/games.js");
        for (const game of testGames) {
          await request(app).post("/api/games").send(game);
        }
      });

      describe("GET", () => {
        test("200: should display all games from a single user", async () => {
          const { body } = await request(app)
            .get("/api/games/nova")
            .expect(200);

          expect(body).toHaveProperty("games");
          expect(Array.isArray(body.games)).toBe(true);
          expect(body.games.length).toBe(8);

          body.games.forEach((game) => {
            expect(game).toMatchObject({
              game_id: expect.any(Number),
              season: expect.any(Number),
              user_name: expect.any(String),
              role_name: expect.any(String),
              map_name: expect.any(String),
              team_score: expect.any(Number),
              enemy_score: expect.any(Number),
              result: expect.any(String),
              sr_change: expect.any(Number),
            });
          });

          expect(body.games.every((game) => game.user_name === "nova")).toBe(
            true
          );
        });

        test("400: should return bad request if user_name is not a string", async () => {
          const { body } = await request(app).get("/api/games/123").expect(400);

          expect(body.message).toBe("Bad request");
        });

        test("404: should return not found if user_name is a string but is not found", async () => {
          const { body } = await request(app)
            .get("/api/games/nonexistentuser")
            .expect(404);

          expect(body.message).toBe("Not found");
        });
      });

      describe("GET (queries)", () => {
        describe("season queries", () => {
          test("200: should filter games by season", async () => {
            const { body } = await request(app)
              .get("/api/games/nova?season=14")
              .expect(200);

            expect(body).toHaveProperty("games");
            expect(Array.isArray(body.games)).toBe(true);
            expect(body.games.length).toBeGreaterThan(0);

            body.games.forEach((game) => {
              expect(game).toMatchObject({
                game_id: expect.any(Number),
                season: 14,
                user_name: "nova",
                team_score: expect.any(Number),
                enemy_score: expect.any(Number),
                result: expect.any(String),
                sr_change: expect.any(Number),
              });
            });
          });

          test("400: should return bad request if season is not a number", async () => {
            const { body } = await request(app)
              .get("/api/games/nova?season=invalid")
              .expect(400);

            expect(body.message).toBe("Bad request");
          });

          test("404: should return not found if no games exist for that season", async () => {
            const { body } = await request(app)
              .get("/api/games/nova?season=1")
              .expect(404);

            expect(body.message).toBe("Not found");
          });
        });

        describe("role queries", () => {
          test("200: should filter games by role", async () => {
            const { body } = await request(app)
              .get("/api/games/nova?role=DPS")
              .expect(200);

            expect(body).toHaveProperty("games");
            expect(Array.isArray(body.games)).toBe(true);
            expect(body.games.length).toBeGreaterThan(0);

            body.games.forEach((game) => {
              expect(game).toMatchObject({
                game_id: expect.any(Number),
                user_name: "nova",
                role_name: "DPS",
                team_score: expect.any(Number),
                enemy_score: expect.any(Number),
                result: expect.any(String),
                sr_change: expect.any(Number),
              });
            });
          });

          test("400: should return bad request if role name is a number", async () => {
            const { body } = await request(app)
              .get("/api/games/nova?role=123")
              .expect(400);

            expect(body.message).toBe("Bad request");
          });

          test("404: should return not found if no games exist for that role", async () => {
            const { body } = await request(app)
              .get("/api/games/nova?role=Support")
              .expect(404);

            expect(body.message).toBe("Not found");
          });

          test("404: should return not found if role does not exist", async () => {
            const { body } = await request(app)
              .get("/api/games/nova?role=InvalidRole")
              .expect(404);

            expect(body.message).toBe("Not found");
          });
        });

        describe("map_name queries", () => {
          test("200: should filter games by map name", async () => {
            const { body } = await request(app)
              .get("/api/games/nova?map_name=Illios")
              .expect(200);

            expect(body).toHaveProperty("games");
            expect(Array.isArray(body.games)).toBe(true);
            expect(body.games.length).toBeGreaterThan(0);

            body.games.forEach((game) => {
              expect(game).toMatchObject({
                game_id: expect.any(Number),
                user_name: "nova",
                map_name: "Illios",
                team_score: expect.any(Number),
                enemy_score: expect.any(Number),
                result: expect.any(String),
                sr_change: expect.any(Number),
              });
            });
          });

          test("200: should handle map names with spaces", async () => {
            const { body } = await request(app)
              .get("/api/games/nova?map_name=Circuit%20Royale")
              .expect(200);

            expect(body).toHaveProperty("games");
            expect(Array.isArray(body.games)).toBe(true);
            expect(body.games.length).toBeGreaterThan(0);

            body.games.forEach((game) => {
              expect(game).toMatchObject({
                game_id: expect.any(Number),
                user_name: "nova",
                map_name: "Circuit Royale",
                team_score: expect.any(Number),
                enemy_score: expect.any(Number),
                result: expect.any(String),
                sr_change: expect.any(Number),
              });
            });
          });

          test("404: should return not found if no games exist for that map", async () => {
            const { body } = await request(app)
              .get("/api/games/nova?map_name=Eichenwalde")
              .expect(404);

            expect(body.message).toBe("Not found");
          });

          test("404: should return not found if map does not exist", async () => {
            const { body } = await request(app)
              .get("/api/games/nova?map_name=InvalidMap")
              .expect(404);

            expect(body.message).toBe("Not found");
          });
        });

        describe("result queries", () => {
          test("200: should filter games by win result", async () => {
            const { body } = await request(app)
              .get("/api/games/nova?result=win")
              .expect(200);

            expect(body).toHaveProperty("games");
            expect(Array.isArray(body.games)).toBe(true);
            expect(body.games.length).toBeGreaterThan(0);

            body.games.forEach((game) => {
              expect(game).toMatchObject({
                game_id: expect.any(Number),
                user_name: "nova",
                result: "win",
                team_score: expect.any(Number),
                enemy_score: expect.any(Number),
                sr_change: expect.any(Number),
              });
            });
          });

          test("200: should filter games by loss result", async () => {
            const { body } = await request(app)
              .get("/api/games/nova?result=loss")
              .expect(200);

            expect(body).toHaveProperty("games");
            expect(Array.isArray(body.games)).toBe(true);
            expect(body.games.length).toBeGreaterThan(0);

            body.games.forEach((game) => {
              expect(game).toMatchObject({
                game_id: expect.any(Number),
                user_name: "nova",
                result: "loss",
                team_score: expect.any(Number),
                enemy_score: expect.any(Number),
                sr_change: expect.any(Number),
              });
            });
          });

          test("400: should return bad request if result is invalid", async () => {
            const { body } = await request(app)
              .get("/api/games/nova?result=invalid")
              .expect(400);

            expect(body.message).toBe("Bad request");
          });

          test("404: should return not found if no games exist with that result", async () => {
            const { body } = await request(app)
              .get("/api/games/mercy_main?result=win")
              .expect(404);

            expect(body.message).toBe("Not found");
          });
        });
      });
      describe("/:game_id", () => {
        describe("GET", () => {
          test("200: should return mode-specific data based on game type", async () => {
            const { body: gamesBody } = await request(app).get(
              "/api/games/nova"
            );

            const clashGame = gamesBody.games.find(
              (game) => game.map_name === "Hanaoka"
            );
            const controlGame = gamesBody.games.find(
              (game) => game.map_name === "Illios"
            );
            const escortGame = gamesBody.games.find(
              (game) => game.map_name === "Circuit Royale"
            );
            const flashpointGame = gamesBody.games.find(
              (game) => game.map_name === "Suravasa"
            );
            const hybridGame = gamesBody.games.find(
              (game) => game.map_name === "King's Row"
            );
            const pushGame = gamesBody.games.find(
              (game) => game.map_name === "Colosseo"
            );

            const { body: clashBody } = await request(app)
              .get(`/api/games/nova/${clashGame.game_id}`)
              .expect(200);

            expect(clashBody.game.mode_specific_data).toMatchObject({
              hero_names: expect.any(Array),
              team_score: expect.any(Number),
              enemy_score: expect.any(Number),
            });

            const { body: controlBody } = await request(app)
              .get(`/api/games/nova/${controlGame.game_id}`)
              .expect(200);

            expect(controlBody.game.mode_specific_data).toHaveLength(2);
            controlBody.game.mode_specific_data.forEach((round) => {
              expect(round).toMatchObject({
                round_number: expect.any(Number),
                submap_name: expect.any(String),
                hero_names: expect.any(Array),
                team_score: expect.any(Number),
                enemy_score: expect.any(Number),
              });
            });

            const { body: escortBody } = await request(app)
              .get(`/api/games/nova/${escortGame.game_id}`)
              .expect(200);

            expect(Array.isArray(escortBody.game.mode_specific_data)).toBe(
              true
            );
            escortBody.game.mode_specific_data.forEach((round) => {
              expect(round).toMatchObject({
                round_number: expect.any(Number),
                starting_side: expect.any(String),
                hero_names: expect.any(Array),
                score: expect.any(Number),
                sub_score: expect.any(String),
              });
            });

            const { body: flashpointBody } = await request(app)
              .get(`/api/games/nova/${flashpointGame.game_id}`)
              .expect(200);

            expect(flashpointBody.game.mode_specific_data).toMatchObject({
              hero_names: expect.any(Array),
              team_score: expect.any(Number),
              enemy_score: expect.any(Number),
            });

            const { body: hybridBody } = await request(app)
              .get(`/api/games/nova/${hybridGame.game_id}`)
              .expect(200);

            expect(Array.isArray(hybridBody.game.mode_specific_data)).toBe(
              true
            );
            hybridBody.game.mode_specific_data.forEach((round) => {
              expect(round).toMatchObject({
                round_number: expect.any(Number),
                starting_side: expect.any(String),
                hero_names: expect.any(Array),
                score: expect.any(Number),
                sub_score: expect.any(String),
              });
            });

            const { body: pushBody } = await request(app)
              .get(`/api/games/nova/${pushGame.game_id}`)
              .expect(200);

            expect(pushBody.game.mode_specific_data).toMatchObject({
              hero_names: expect.any(Array),
              team_score: expect.any(Number),
              team_distance: expect.any(String),
              enemy_score: expect.any(Number),
              enemy_distance: expect.any(String),
            });
          });

          test("400: should return bad request if game_id is not a number", async () => {
            const { body } = await request(app)
              .get("/api/games/nova/not-a-number")
              .expect(400);

            expect(body.message).toBe("Bad request");
          });

          test("404: should return not found if game_id does not exist", async () => {
            const { body } = await request(app)
              .get("/api/games/nova/999999")
              .expect(404);

            expect(body.message).toBe("Not found");
          });

          test("404: should return not found if game exists but belongs to different user", async () => {
            const { body: gamesBody } = await request(app).get(
              "/api/games/nova"
            );
            const gameId = gamesBody.games[0].game_id;

            const { body } = await request(app)
              .get(`/api/games/omby/${gameId}`)
              .expect(404);

            expect(body.message).toBe("Not found");
          });

          test("200: should return mode-specific data based on game type", async () => {
            const { body: gamesBody } = await request(app).get(
              "/api/games/nova"
            );

            const controlGame = gamesBody.games.find(
              (game) => game.map_name === "Illios"
            );
            const pushGame = gamesBody.games.find(
              (game) => game.map_name === "Colosseo"
            );

            const { body: controlBody } = await request(app)
              .get(`/api/games/nova/${controlGame.game_id}`)
              .expect(200);

            expect(controlBody.game.mode_specific_data).toHaveLength(2);
            controlBody.game.mode_specific_data.forEach((round) => {
              expect(round).toMatchObject({
                round_number: expect.any(Number),
                submap_name: expect.any(String),
                hero_names: expect.any(Array),
                team_score: expect.any(Number),
                enemy_score: expect.any(Number),
              });
            });

            const { body: pushBody } = await request(app)
              .get(`/api/games/nova/${pushGame.game_id}`)
              .expect(200);

            expect(pushBody.game.mode_specific_data).toMatchObject({
              hero_names: expect.any(Array),
              team_score: expect.any(Number),
              team_distance: expect.any(String),
              enemy_score: expect.any(Number),
              enemy_distance: expect.any(String),
            });
          });
        });
      });
    });
  });
});

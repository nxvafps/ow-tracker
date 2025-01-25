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
  describe("/api/healthcheck", () => {
    describe("GET", () => {
      it("should return a status code of 200", () => {
        return request(app).get("/api/healthcheck").expect(200);
      });
    });
  });

  describe("/api/heroes", () => {
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

  describe("/api/maps", () => {
    describe("/api/maps", () => {
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
    });

    describe("/api/maps/:map_name", () => {
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
});

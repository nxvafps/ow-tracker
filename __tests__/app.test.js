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
    });
    describe("GET /api/maps (queries)", () => {});
    describe("GET /api/maps/:map_name", () => {});
  });
});

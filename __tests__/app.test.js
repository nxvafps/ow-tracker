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

describe("/api", () => {
  describe("GET /api/healthcheck", () => {
    it("should return a status code of 200", () => {
      return request(app).get("/api/healthcheck").expect(200);
    });
  });
});

describe("/api/heroes", () => {
  describe("GET /api/heroes", () => {
    test("200: responds with an array of heroes", async () => {
      const response = await request(app).get("/api/heroes").expect(200);

      expect(response.body).toHaveProperty("heroes");
      expect(Array.isArray(response.body.heroes)).toBe(true);
      expect(response.body.heroes.length).toBeGreaterThan(0);
      response.body.heroes.forEach((hero) => {
        expect(hero).toMatchObject({
          hero_name: expect.any(String),
          role_name: expect.any(String),
        });
      });
    });
  });

  describe("GET /api/heroes (queries)", () => {
    test("200: responds with an array of DPS heroes", async () => {
      const response = await request(app)
        .get("/api/heroes?role=dps")
        .expect(200);

      expect(response.body).toHaveProperty("heroes");
      expect(Array.isArray(response.body.heroes)).toBe(true);
      expect(response.body.heroes.length).toBeGreaterThan(0);
      response.body.heroes.forEach((hero) => {
        expect(hero).toMatchObject({
          hero_name: expect.any(String),
          role_name: "DPS",
        });
      });
    });

    test("200: responds with an array of support heroes", async () => {
      const response = await request(app)
        .get("/api/heroes?role=support")
        .expect(200);

      expect(response.body).toHaveProperty("heroes");
      expect(Array.isArray(response.body.heroes)).toBe(true);
      expect(response.body.heroes.length).toBeGreaterThan(0);
      response.body.heroes.forEach((hero) => {
        expect(hero).toMatchObject({
          hero_name: expect.any(String),
          role_name: "Support",
        });
      });
    });

    test("200: responds with an array of tank heroes", async () => {
      const response = await request(app)
        .get("/api/heroes?role=tank")
        .expect(200);

      expect(response.body).toHaveProperty("heroes");
      expect(Array.isArray(response.body.heroes)).toBe(true);
      expect(response.body.heroes.length).toBeGreaterThan(0);
      response.body.heroes.forEach((hero) => {
        expect(hero).toMatchObject({
          hero_name: expect.any(String),
          role_name: "Tank",
        });
      });
    });

    test("404: responds with error message when given invalid role", async () => {
      const response = await request(app)
        .get("/api/heroes?role=invalid")
        .expect(404);

      expect(response.body.message).toBe("No heroes found with role: invalid");
    });

    test("400: responds with error message when given invalid data type", async () => {
      const response = await request(app)
        .get("/api/heroes?role=123")
        .expect(400);

      expect(response.body.message).toEqual(
        "Invalid input: role must be a string"
      );
    });
  });

  describe("GET /api/heroes/:hero_name", () => {
    test("200: responds with a singular hero", async () => {
      const response = await request(app).get("/api/heroes/ana").expect(200);

      expect(response.body).toHaveProperty("hero");
      expect(Array.isArray(response.body.hero)).toBe(true);
      expect(response.body.hero.length).toBe(1);
      expect(response.body.hero[0]).toMatchObject({
        hero_name: "Ana",
        role_name: "Support",
      });
    });
  });
});

describe("/api/maps", () => {
  describe("GET /api/maps", () => {});
  describe("GET /api/maps (queries)", () => {});
  describe("GET /api/maps/:map_name", () => {});
});

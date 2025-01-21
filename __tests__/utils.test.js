const formatHeroes = require("../app/db/utils/formatHeroes.js");

describe("formatHeroes", () => {
  let hero, heroes, roles;
  beforeEach(() => {
    hero = [
      {
        hero_name: "Ana",
        role_name: "Support",
      },
    ];

    heroes = [
      {
        hero_name: "Ana",
        role_name: "Support",
      },
      {
        hero_name: "Ashe",
        role_name: "DPS",
      },
    ];

    roles = [
      { role_id: 1, role_name: "DPS" },
      { role_id: 2, role_name: "Support" },
      { role_id: 3, role_name: "Tank" },
    ];
  });

  it("returns a new object", () => {
    expect(formatHeroes(hero, roles)).not.toBe(hero);
    expect(formatHeroes(hero, roles)).not.toBe(roles);
  });

  it("does not mutate the input", () => {
    formatHeroes(hero, roles);
    expect(hero).toEqual([
      {
        hero_name: "Ana",
        role_name: "Support",
      },
    ]);
  });

  it("returns an empty array when passed an empty array", () => {
    expect(formatHeroes([], roles)).toEqual([]);
  });

  it("updates role id on one single object", () => {
    expect(formatHeroes(hero, roles)).toEqual([
      {
        hero_name: "Ana",
        role_id: 2,
      },
    ]);
  });

  it("updates role id on multiple objects", () => {
    expect(formatHeroes(heroes, roles)).toEqual([
      {
        hero_name: "Ana",
        role_id: 2,
      },
      {
        hero_name: "Ashe",
        role_id: 1,
      },
    ]);
  });
});

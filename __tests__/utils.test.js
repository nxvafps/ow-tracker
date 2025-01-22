const formatHeroes = require("../app/db/utils/formatHeroes.js");
const formatData = require("../app/db/utils/formatData");

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

describe("formatData", () => {
  let hero, heroes, map, maps;
  beforeEach(() => {
    hero = hero = [
      {
        hero_name: "Ana",
        role_id: 2,
      },
    ];

    heroes = [
      {
        hero_name: "Ana",
        role_id: 2,
      },
      {
        hero_name: "Ashe",
        role_id: 1,
      },
    ];

    map = [
      {
        mapName: "Antarctic Peninsula",
        gameMode: "Control",
        submaps: {
          submap1: "Icebreaker",
          submap2: "Labs",
          submap3: "Sublevel",
        },
        distances: null,
      },
    ];

    maps = [
      {
        mapName: "Antarctic Peninsula",
        gameMode: "Control",
        submaps: {
          submap1: "Icebreaker",
          submap2: "Labs",
          submap3: "Sublevel",
        },
        distances: null,
      },
      {
        mapName: "Blizzard World",
        gameMode: "Hybrid",
        submaps: null,
        distances: {
          distance1: 113.67,
          distance2: 111.54,
        },
      },
    ];
  });
  it("should return an array", () => {
    expect(Array.isArray(formatData(hero))).toBe(true);
    expect(Array.isArray(formatData(heroes))).toBe(true);
    expect(Array.isArray(formatData(map))).toBe(true);
  });
  it("should not mutate the input", () => {
    formatData(hero);
    formatData(heroes);
    formatData(map);
    expect(hero).toEqual([
      {
        hero_name: "Ana",
        role_id: 2,
      },
    ]);
    expect(heroes).toEqual([
      {
        hero_name: "Ana",
        role_id: 2,
      },
      {
        hero_name: "Ashe",
        role_id: 1,
      },
    ]);
    expect(map).toEqual([
      {
        mapName: "Antarctic Peninsula",
        gameMode: "Control",
        submaps: {
          submap1: "Icebreaker",
          submap2: "Labs",
          submap3: "Sublevel",
        },
        distances: null,
      },
    ]);
  });
  it("should return an empty array when passed an empty array", () => {
    expect(formatData([])).toEqual([]);
  });
  it("should format a single flat object", () => {
    expect(formatData(hero)).toEqual([["Ana", 2]]);
  });
  it("should format multiple flat objects", () => {
    expect(formatData(heroes)).toEqual([
      ["Ana", 2],
      ["Ashe", 1],
    ]);
  });
  it("should format a nested object", () => {
    expect(formatData(map)).toEqual([
      [
        "Antarctic Peninsula",
        "Control",
        {
          submap1: "Icebreaker",
          submap2: "Labs",
          submap3: "Sublevel",
        },
        null,
      ],
    ]);
  });
  it("should format multiple nested objects", () => {
    expect(formatData(maps)).toEqual([
      [
        "Antarctic Peninsula",
        "Control",
        {
          submap1: "Icebreaker",
          submap2: "Labs",
          submap3: "Sublevel",
        },
        null,
      ],
      [
        "Blizzard World",
        "Hybrid",
        null,
        {
          distance1: 113.67,
          distance2: 111.54,
        },
      ],
    ]);
  });
});

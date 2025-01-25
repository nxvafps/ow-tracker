const formatHeroes = require("../app/db/utils/formatHeroes.js");
const formatData = require("../app/db/utils/formatData");
const formatUsers = require("../app/db/utils/formatUsers.js");

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

describe("formatUsers", () => {
  let user, users, heroes, roles;
  beforeEach(() => {
    user = [
      {
        user_name: "nova",
        user_main_role: "DPS",
        user_main_hero: "Echo",
        dps_sr: 2500,
        support_sr: null,
        tank_sr: null,
      },
    ];

    users = [
      {
        user_name: "nova",
        user_main_role: "DPS",
        user_main_hero: "Echo",
        dps_sr: 2500,
        support_sr: null,
        tank_sr: null,
      },
      {
        user_name: "omby",
        user_main_role: "Support",
        user_main_hero: "Kiriko",
        dps_sr: 2000,
        support_sr: 1500,
        tank_sr: null,
      },
    ];

    roles = [
      { role_id: 1, role_name: "DPS" },
      { role_id: 2, role_name: "Support" },
      { role_id: 3, role_name: "Tank" },
    ];

    heroes = [
      { hero_id: 1, hero_name: "Echo" },
      { hero_id: 2, hero_name: "Kiriko" },
    ];
  });

  it("returns a new object", () => {
    expect(formatUsers(user, heroes, roles)).not.toBe(user);
    expect(formatUsers(user, heroes, roles)).not.toBe(heroes);
    expect(formatUsers(user, heroes, roles)).not.toBe(roles);
  });

  it("does not mutate the input", () => {
    formatUsers(user, heroes, roles);
    expect(user).toEqual([
      {
        user_name: "nova",
        user_main_role: "DPS",
        user_main_hero: "Echo",
        dps_sr: 2500,
        support_sr: null,
        tank_sr: null,
      },
    ]);
  });

  it("returns an empty array when passed an empty array", () => {
    expect(formatUsers([], heroes, roles)).toEqual([]);
  });

  it("updates role and hero ids on one single object", () => {
    expect(formatUsers(user, heroes, roles)).toEqual([
      {
        user_name: "nova",
        user_main_role: 1,
        user_main_hero: 1,
        dps_sr: 2500,
        support_sr: null,
        tank_sr: null,
      },
    ]);
  });

  it("updates role and hero ids on multiple objects", () => {
    expect(formatUsers(users, heroes, roles)).toEqual([
      {
        user_name: "nova",
        user_main_role: 1,
        user_main_hero: 1,
        dps_sr: 2500,
        support_sr: null,
        tank_sr: null,
      },
      {
        user_name: "omby",
        user_main_role: 2,
        user_main_hero: 2,
        dps_sr: 2000,
        support_sr: 1500,
        tank_sr: null,
      },
    ]);
  });
});

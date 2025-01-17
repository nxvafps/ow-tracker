const db = require("../db/index.js");

const fetchClashMap = require("./fetch-clash-map.js");
const fetchControlMap = require("./fetch-control-map.js");
const fetchEscortMap = require("./fetch-escort-map.js");
const fetchFlashpointMap = require("./fetch-flashpoint-map.js");
const fetchHybridMap = require("./fetch-hybrid-map.js");
const fetchPushMap = require("./fetch-push-map.js");

const formatMapName = (mapName) => {
  return mapName
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

const fetchMap = async (mapName) => {
  const formattedName = formatMapName(mapName);
  const result = await db.query(
    "SELECT game_mode_id FROM maps WHERE map_name = $1",
    [formattedName]
  );
  if (!result.rows.length) return [];
  const mode = result.rows[0].game_mode_id;
  switch (mode) {
    case 1:
      return await fetchClashMap(formattedName);
    case 2:
      return await fetchControlMap(formattedName);
    case 3:
      return await fetchEscortMap(formattedName);
    case 4:
      return await fetchFlashpointMap(formattedName);
    case 5:
      return await fetchHybridMap(formattedName);
    case 6:
      return await fetchPushMap(formattedName);
  }
};

fetchMap("colosseo");
//busan
//circuit royale
//suravasa
//numbani
//colosseo

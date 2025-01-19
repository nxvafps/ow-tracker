const db = require("../db");

class MapModel {
  async getMapByName(mapName) {
    const formattedName = this.formatMapName(mapName);

    const query = `
      SELECT 
        m.map_name AS map,
        g.game_mode_name AS game_mode,
        CASE 
          WHEN m.game_mode_id = 2 THEN (
            SELECT json_agg(cs.submap_name ORDER BY cs.submap_id)
            FROM control_submaps cs
            WHERE cs.map_id = m.map_id
          )
          ELSE NULL
        END AS submaps,
        CASE 
          WHEN m.game_mode_id = 3 THEN 
            (SELECT json_build_object(
              'distance_1', ed.distance_1,
              'distance_2', ed.distance_2,
              'distance_3', ed.distance_3
            ) FROM escort_details ed WHERE ed.map_id = m.map_id)
          WHEN m.game_mode_id IN (5,6) THEN 
            (SELECT json_build_object(
              'distance_1', d.distance_1,
              'distance_2', d.distance_2
            ) FROM (
              SELECT hd.distance_1, hd.distance_2 
              FROM hybrid_details hd 
              WHERE hd.map_id = m.map_id
              UNION ALL
              SELECT pd.distance_1, pd.distance_2 
              FROM push_details pd 
              WHERE pd.map_id = m.map_id
            ) d LIMIT 1)
          ELSE NULL
        END AS distances
      FROM maps m
      JOIN game_modes g ON m.game_mode_id = g.game_mode_id
      WHERE m.map_name = $1`;

    const result = await db.query(query, [formattedName]);
    return result.rows;
  }

  async getMapsByMode(gameMode) {
    const query = `
      SELECT 
        m.map_name AS map,
        g.game_mode_name AS game_mode,
        CASE 
          WHEN m.game_mode_id = 2 THEN (
            SELECT json_agg(cs.submap_name ORDER BY cs.submap_id)
            FROM control_submaps cs
            WHERE cs.map_id = m.map_id
          )
          ELSE NULL
        END AS submaps,
        CASE 
          WHEN m.game_mode_id = 3 THEN 
            (SELECT json_build_object(
              'distance_1', ed.distance_1,
              'distance_2', ed.distance_2,
              'distance_3', ed.distance_3
            ) FROM escort_details ed WHERE ed.map_id = m.map_id)
          WHEN m.game_mode_id IN (5,6) THEN 
            (SELECT json_build_object(
              'distance_1', d.distance_1,
              'distance_2', d.distance_2
            ) FROM (
              SELECT hd.distance_1, hd.distance_2 
              FROM hybrid_details hd 
              WHERE hd.map_id = m.map_id
              UNION ALL
              SELECT pd.distance_1, pd.distance_2 
              FROM push_details pd 
              WHERE pd.map_id = m.map_id
            ) d LIMIT 1)
          ELSE NULL
        END AS distances
      FROM maps m
      JOIN game_modes g ON m.game_mode_id = g.game_mode_id
      WHERE LOWER(g.game_mode_name) = LOWER($1)
      ORDER BY m.map_name`;

    const result = await db.query(query, [gameMode]);
    return result.rows;
  }

  async getAllMaps(gameMode = null) {
    if (gameMode) {
      return this.getMapsByMode(gameMode);
    }
    const query = `
      SELECT 
        m.map_name AS map,
        g.game_mode_name AS game_mode,
        CASE 
          WHEN m.game_mode_id = 2 THEN (
            SELECT json_agg(cs.submap_name ORDER BY cs.submap_id)
            FROM control_submaps cs
            WHERE cs.map_id = m.map_id
          )
          ELSE NULL
        END AS submaps,
        CASE 
          WHEN m.game_mode_id = 3 THEN 
            (SELECT json_build_object(
              'distance_1', ed.distance_1,
              'distance_2', ed.distance_2,
              'distance_3', ed.distance_3
            ) FROM escort_details ed WHERE ed.map_id = m.map_id)
          WHEN m.game_mode_id IN (5,6) THEN 
            (SELECT json_build_object(
              'distance_1', d.distance_1,
              'distance_2', d.distance_2
            ) FROM (
              SELECT hd.distance_1, hd.distance_2 
              FROM hybrid_details hd 
              WHERE hd.map_id = m.map_id
              UNION ALL
              SELECT pd.distance_1, pd.distance_2 
              FROM push_details pd 
              WHERE pd.map_id = m.map_id
            ) d LIMIT 1)
          ELSE NULL
        END AS distances
      FROM maps m
      JOIN game_modes g ON m.game_mode_id = g.game_mode_id
      ORDER BY m.map_name`;

    const result = await db.query(query);
    return result.rows;
  }

  formatMapName(mapName) {
    return mapName
      .replace(/-/g, " ")
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  }
}

module.exports = new MapModel();

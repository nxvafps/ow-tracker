\c overwatch_tracker

SELECT maps.map_name, control_submaps.submap_name
FROM maps
JOIN control_submaps ON maps.map_id = control_submaps.map_id
ORDER BY maps.map_id ASC;
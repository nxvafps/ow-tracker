\c overwatch_tracker

SELECT maps.map_name, hybrid_details.distance_1, hybrid_details.distance_2
FROM maps
JOIN hybrid_details ON maps.map_id = hybrid_details.map_id;
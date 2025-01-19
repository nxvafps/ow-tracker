\c overwatch_tracker

SELECT maps.map_name, push_details.distance_1, push_details.distance_2
FROM maps
JOIN push_details ON maps.map_id = push_details.map_id;
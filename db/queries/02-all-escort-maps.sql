\c overwatch_tracker

SELECT maps.map_name, escort_details.distance_1, escort_details.distance_2, escort_details.distance_3
FROM maps
JOIN escort_details ON maps.map_id = escort_details.map_id;
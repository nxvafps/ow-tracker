\c overwatch_tracker

\echo '\n All DPS heroes:\n'
SELECT heroes.hero_name, roles.role_name
FROM heroes
LEFT JOIN roles ON heroes.role_id = roles.role_id
WHERE roles.role_name = 'DPS';

\echo '\n All support heroes:\n'
SELECT heroes.hero_name, roles.role_name
FROM heroes
LEFT JOIN roles ON heroes.role_id = roles.role_id
WHERE roles.role_name = 'Support';

\echo '\n All tank heroes:\n'
SELECT heroes.hero_name, roles.role_name
FROM heroes
LEFT JOIN roles ON heroes.role_id = roles.role_id
WHERE roles.role_name = 'Tank';
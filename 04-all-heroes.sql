\c overwatch_tracker

\echo '\n All heroes with role names:\n'
SELECT heroes.hero_name, roles.role_name
FROM heroes
LEFT JOIN roles ON heroes.role_id = roles.role_id;


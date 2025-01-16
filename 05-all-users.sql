\c overwatch_tracker

\echo '\n All users with role and hero names:\n'
SELECT users.user_name, roles.role_name, heroes.hero_name
FROM users
JOIN roles ON users.user_main_role = roles.role_id
JOIN heroes ON users.user_main_hero = heroes.hero_id;
const formatUsers = (users, heroes, roles) => {
  return users.map((user) => {
    const matchingRole = roles.find(
      (role) => role.role_name === user.user_main_role
    );
    const matchingHero = heroes.find(
      (hero) => hero.hero_name === user.user_main_hero
    );
    return {
      user_name: user.user_name,
      user_main_role: matchingRole.role_id,
      user_main_hero: matchingHero.hero_id,
      dps_sr: user.dps_sr,
      support_sr: user.support_sr,
      tank_sr: user.tank_sr,
    };
  });
};

module.exports = formatUsers;

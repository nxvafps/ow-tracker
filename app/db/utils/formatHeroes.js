const formatHeroes = (heroes, roles) => {
  return heroes.map((hero) => {
    const matchingRole = roles.find(
      (role) => role.role_name === hero.role_name
    );
    return {
      hero_name: hero.hero_name,
      role_id: matchingRole.role_id,
    };
  });
};

module.exports = formatHeroes;

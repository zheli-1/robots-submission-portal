const Knex = require('knex');
const bcrypt = require('bcrypt');

const knexConfig = require('../../db/knexfile');

const knex = Knex(knexConfig[process.env.NODE_ENV]);

async function getTeamForLoginData(name, password) {
  const [team] = await knex('teams')
    .select()
    .where({ name })
    .limit(1);

  if (!team) {
    return null;
  }

  const isPasswordValid = await bcrypt.compare(password, team.password);

  if (!isPasswordValid) {
    return null;
  }

  return {
    id: team.id,
    username: team.name,
    created_at: team.created_at,
  };
}

async function getTeam(query) {
  const [team] = await knex('teams')
    .select()
    .where(query)
    .limit(1);
  return team;
}

async function getTeamById(id) {
  return getTeam({ id });
}

module.exports = {
  getTeamForLoginData,
  getTeamById,
};

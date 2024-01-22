const bcrypt = require('bcrypt');
const knex = require('../../db');

async function createUser({ name, password }) {
  const hashedPass = await bcrypt.hash(password, 5);
  const [team] = await knex('teams')
    .insert({
      name : name,
      password: hashedPass,
      created_at: new Date(),
      updated_at: new Date(),
    })
    .returning(['name']);
  return team;
}

module.exports = {
  createUser,
};

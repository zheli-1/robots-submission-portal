const knex = require('../../db');

async function getUser(id) {
  const [user] = await knex('teams')
    .where('id', id)
    .select('name');
  return user;
}

async function updateUserInfo({ name, username: email, id }) {
  const [user] = await knex('teams')
    .where({ id })
    .update({
      name,
      updated_at: new Date(),
    })
    .returning(['name']);
  return user;
}

module.exports = {
  getUser,
  updateUserInfo,
};

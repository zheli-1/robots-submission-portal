const bcrypt = require('bcrypt');

exports.seed = async function seed(knex) {
  const hashedPass = await bcrypt.hash('secret', 5);
  await knex('teams').insert({
    name: 'admin_zl',
    password: hashedPass,
    created_at: new Date(),
    updated_at: new Date(),
    // email_verified_at: new Date(),
  });
};

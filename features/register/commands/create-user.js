const registerRepo = require('../repository');

async function createUser(req, res) {
  let user = {};
  const registerSuccessMessage = 'You have successfully registered, you can now log in.';
  try {
    user = await registerRepo.createUser(req.body);
  } catch (error) {
    const { code } = error;
    console.log(code);
    const databaseError =
      code === '23505' ? 'The team name has already been taken.' : 'Something went wrong.';
    req.session.messages = { errors: databaseError };
    res.redirect('/register');
  }

  console.log(user);
  if (user.name) {
    req.session.messages = { success: registerSuccessMessage };
    res.redirect('/login');
  }
}

module.exports = createUser;

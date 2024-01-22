const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const { getTeamForLoginData, getTeamById } = require('./repository');

module.exports = function initAuthMiddleware(app) {
  passport.use(
    new LocalStrategy(async (username, password, done) => {
      const user = await getTeamForLoginData(username, password);
      console.log('init-auth-middleware');
      if (!user) {
        return done(null, false);
      }
      return done(null, user);
    })
  );

  passport.serializeUser((user, done) => done(null, user.id));

  passport.deserializeUser(async (id, done) => {
    const user = await getTeamById(id);
    if (!user) {
      return done(`Could not deserialize user with id ${id}`);
    }
    return done(null, user);
  });

  app.use(passport.initialize());
  app.use(passport.session());
};

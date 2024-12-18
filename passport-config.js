const LocalStrategy = require('passport-local').Strategy;
const pool = require('./db'); // Database connection
const bcrypt = require('bcrypt');

function initialize(passport) {
  const authenticateUser = async (username, password, done) => {
    try {
      const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
      const user = result.rows[0];

      if (!user) {
        return done(null, false, { message: 'No user with that username' });
      }

      const isMatch = await bcrypt.compare(password, user.hashed_password);
      if (isMatch) {
        return done(null, user);
      } else {
        return done(null, false, { message: 'Password incorrect' });
      }
    } catch (err) {
      return done(err);
    }
  };

  passport.use(new LocalStrategy({ usernameField: 'username', passwordField: 'password' }, authenticateUser));
  passport.serializeUser((user, done) => done(null, user.user_id));
  passport.deserializeUser((id, done) => {
    pool.query('SELECT * FROM users WHERE user_id = $1', [id], (err, result) => {
      if (err) {
        return done(err);
      }
      return done(null, result.rows[0]);
    });
  });
}

module.exports = initialize;


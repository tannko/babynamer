const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const { User } = require('../models/UserSchema');
const bcrypt = require('bcrypt');

module.exports = function() {

  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });

  passport.use(new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password'
    },
    function(username, password, done) {
      console.log("authentication");

      User.findOne({ email: username }).
        then( user => {
          if (!user) {
            console.log('User does not exist');
            return done(null, false, { message: 'User does not exist' });
          }

          bcrypt.compare(password, user.password, function(err, res) {
            if (err) {
              console.log('bcrypt err: ' + err);
              return done(err);
            }
            if (!res) {
              console.log('Invalid password');
              return done(null, false, { message: 'Invalid password' });
            }
            console.log('User logged in');
            return done(null, user);
          });
        }).
        catch( error => {
          console.log("passport error: " + error);
          return done(err);
        });
    }
  ));
  return passport;
};

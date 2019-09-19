const { User, validate } = require('../models/UserSchema');
const bcrypt = require('bcrypt');

exports.auth_signup_post = function(req, res, next) {
  console.log('server signup');
  const {error} = validate(req.body);
  if (error) {
    console.log('error from server: ' + error.details[0].message);
    return res.status(400).send(error.details[0].message);
  }

  const newUser = new User({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password
  });

  User.findOne({ email: req.body.email }).
    then( user => {
      if (user) {
        console.log("user already exists");
        throw new Error("user already exists");
      } else {
        return bcrypt.hash(newUser.password, 10);
      }
    }).
    then( hashedPassword => {
      newUser.password = hashedPassword;
      return newUser.save();
    }).
    then( user => {
      next();
    }).
    catch( error => {
      console.log("signup error: " + error);
      next(error);
    });
};

exports.auth_signin_post = function(req, res) {
  console.log("authentication successful, user: " + req.user);
  res.send(req.user);
};

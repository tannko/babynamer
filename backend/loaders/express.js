const cors = require('cors');
const bodyParser = require('body-parser');
const logger = require('morgan');
const session = require('express-session');
const passport = require('passport');
const routes = require('../api/routes');

module.exports = function (app) {
  app.use(cors());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());
  app.use(logger('dev'));
  app.use(session({ secret: process.env.SECRET || "mysecret" }));
  app.use(passport.initialize());
  app.use(passport.session());
  app.use('/api', routes());
};

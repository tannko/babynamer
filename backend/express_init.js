const cors = require('cors');
const bodyParser = require('body-parser');
const logger = require('morgan');
const session = require('express-session');

module.exports = function (app) {
  app.use(cors());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());
  app.use(logger('dev'));
  app.use(session({ secret: "mysecret" }));


};

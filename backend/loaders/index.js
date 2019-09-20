const expressLoader = require('./express');
const mongooseLoader = require('./mongoose');

module.exports = function(app) {
  expressLoader(app);
  mongooseLoader();
};

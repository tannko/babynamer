const mongoose = require('mongoose');
const config = require('../config');

module.exports = function () {
  //const dbRoute =
    //'mongodb+srv://admin:t9gj8OiFkA75zy2p@clusterfornames-sbtoo.mongodb.net/names?retryWrites=true&w=majority';

  mongoose.connect(config.dbRoute, { useNewUrlParser: true });

  let db = mongoose.connection;

  db.once('open', () => console.log('connected to the database'));
  db.on('error', console.error.bind(console, 'MongoDB connection error:'));
};

const express = require('express');
const config = require('./config');
const http = require('http');

function startServer() {
  const app = express();
  require('./express_init')(app);

  require('./mongoose_init')();

  const passport = require('./passport_init')(app);

  const router = require('./routes_init')(passport);

  // append /api for our http requests
  app.use('/api', router);

  const server = http.createServer(app);
  require('./sockets_init')(server);

  server.listen(config.port);
}

startServer();

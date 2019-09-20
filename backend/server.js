const express = require('express');
const config = require('./config');
const http = require('http');
const loaders = require('./loaders');
const sockets = require('./api/sockets');

function startServer() {
  const app = express();
  loaders(app);

  const server = http.createServer(app);
  sockets(server);

  server.listen(config.port);
}

startServer();

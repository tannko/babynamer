require('dotenv').config();
const express = require('express');
const config = require('./config');
const http = require('http');
const loaders = require('./loaders');
const sockets = require('./api/sockets');
const path = require('path');

function startServer() {
  const app = express();
  loaders(app);


  app.use(express.static(path.join(__dirname, "../client/build")));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../client/build/index.html"));
  });

  const server = http.createServer(app);
  sockets(server);

  server.listen(config.port);
}

startServer();

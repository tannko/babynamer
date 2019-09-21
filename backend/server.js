require('dotenv').config();
process.env.PWD = process.cwd()
const express = require('express');
const config = require('./config');
const http = require('http');
const loaders = require('./loaders');
const sockets = require('./api/sockets');
const path = require('path');

function startServer() {
  const app = express();
  loaders(app);


  //app.use(express.static(path.join(process.env.PWD , "../client/build")));
  app.use(express.static(path.join(process.env.PWD,'../client', 'public')));
  app.get("*", (req, res) => {
    res.sendFile(path.join(process.env.PWD, '../client', 'public', 'index.html'));
    //res.sendFile(path.join(process.env.PWD , "../client/build/index.html"));
  });

  const server = http.createServer(app);
  sockets(server);

  server.listen(config.port);
}

startServer();

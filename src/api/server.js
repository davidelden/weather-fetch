const express = require('express'),
      routes = require('./routes.js'),
      app = express(),
      port = process.env.PORT || 3000;

app.use(routes);

const startServer = () => {
  app.listen(port, () => console.log(`Example app listening on port ${port}!`));
}

module.exports = startServer;

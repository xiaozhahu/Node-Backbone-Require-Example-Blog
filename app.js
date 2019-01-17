/**
 * Module dependencies.
 */
let express = require('express');
let mongoose = require('mongoose');
let http = require('http');
let config = require('./config');
let app = express();
let server;

if (config.dataSource.DB_USER && config.dataSource.DB_PASSWORD) {
  mongoose.createConnection('mongodb://' + config.dataSource.DB_USER + ':'
    + config.dataSource.DB_PASSWORD + '@' + config.dataSource.DB_ADDRESS + '/' + config.dataSource.DB_NAME);
} else {
  mongoose.createConnection('mongodb://' + config.dataSource.DB_ADDRESS + '/' + config.dataSource.DB_NAME);
}

mongoose.connect('mongodb://localhost/' + config.dataSource.DB_NAME);

app.configure(function () {
  app.set('port', config.server.SERVER_PORT || 3000);
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function () {
  app.use(express.errorHandler());
});

// config routers
['post'].forEach(function (route) {
  require('./routes/' + route)(app);
});

server = app.listen(app.get('port'), function () {
  console.info("Worker #" + cluster.worker.id, "with pid", cluster.worker.process.pid, "listening on port", app.get('port'));
});

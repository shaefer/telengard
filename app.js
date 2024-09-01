var http = require('http'),
  express = require('express'),
  util = require('util'),
  settings = require('settings'),
  moment = require('moment'),
  path = require('path'),
  fs = require('fs'),
  qs = require('querystring'),
  _ = require('underscore'),
  request = require('request'),
  flash = require('connect-flash'),
  cons = require('consolidate');

// Load the config file.
var projectDir = __dirname;
var config = new settings(path.join(projectDir, 'config.js')).getEnvironment();

var app = module.exports = express();
var server = http.createServer(app);

app.configure(function() {
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.cookieParser());
  app.use(express.session({ cookie: { maxAge: 60000 }, secret: config.app_secret }));
  app.use(flash());
  app.use(express.methodOverride());
  app.use(app.router);
  app.engine('html', cons.handlebars);
  app.set('view engine', 'html');
  app.set('views', 'views');
  app.use(express.static('public'));
  app.use(express.static('public/js/lib'));
});

if (!module.parent) {
  server.listen(process.env.PORT || config.port);
  console.log('Server started at %s', (new Date()).toUTCString());
  console.log('Listening on port %s', server.address().port);
}

// Helpers
redirector = function(req, res, path, error) {
  if (error) {
    req.flash(error.name, error.value);
  }
  res.redirect(path);
}

// Routes
app.get('/', function (req, res) {
    //res.render('index_v2.html');
    res.render('index.html');
});

app.get('/v2', function (req, res) {
  res.render('index_v2.html');
});

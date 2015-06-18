var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var partials = require('express-partials');
var methodOverride = require('method-override');
var session = require('express-session');

var routes = require('./routes/index');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(partials());
// uncomment after placing your favicon in /public
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser('Quiz 2015'));
app.use(session());
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

// Helpers dinamicos:
app.use(function(req, res, next) {

  // guardar path en session.redir para despues de login
  if (!req.path.match(/\/login|\/logout/)) {
	req.session.redir = req.path;
  }

  // Hacer visible req.session en las vistas
  res.locals.session = req.session;
  next();
});

// Auto-logout
app.use(function(req, res, next) {

  if (req.session.user) {
	  console.log('Hay alguien logado');
	  var now = (new Date()).getTime();
	  if (!req.session.lastTime
		  || (now - req.session.lastTime) < 120000) {
		  // Último acceso hace menos de 2 minutos. Actualizamos
		  console.log('Reciente. Now = ' + now + ', req.session.lastTime = ' + req.session.lastTime + ', diff = ' + (now - req.session.lastTime));
		  req.session.lastTime = now;
	  } else {
		  console.log('Antiguo. Now = ' + now + ', req.session.lastTime = ' + req.session.lastTime + ', diff = ' + (now - req.session.lastTime));
		  // Último acceso hace dos minutos o más
		  delete req.session.user;
		  delete req.session.lastTime;
	  }
  }

  next();
});

app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err,
	  errors: []
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {},
	errors: []
  });
});


module.exports = app;

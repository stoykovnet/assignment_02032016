// Express imports.
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

// Database connection and models imports.
var mongoose = require('mongoose');
var passport = require('passport'); //Auth.
require('./models/Users');
require('./config/passport'); //Auth.
var databaseUrl = require('./config/getDatabaseUrl');

// Routes imports.
var routes = require('./routes/index');
var authentication = require('./routes/authentication');

// Initialize application.
var app = express();

/**
 * Database connection configuration.
 */
mongoose.connect(databaseUrl());

/**
 * View engine setup
 */
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

/**
 * Server configurations.
 */
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(passport.initialize());

/**
 * Routes
 */
app.use('/', routes);
app.use('/authentication', authentication);

/**
 * 404 & 500 Error handlers.
 */
// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;

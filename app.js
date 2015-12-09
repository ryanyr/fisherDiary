var express = require('express');
var path = require('path');
var flash = require('connect-flash');
var config = require('./config');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var moment = require('moment');
var mongoose = require('mongoose');
var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy;

var ejs = require('ejs');
ejs.filters.fromNow = function(date){
    moment.lang('zh-cn');
    return moment(date).fromNow();
}


var app = express();

mongoose.connect(config.dbConnectString);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {
  console.log('thats fine, we have connected to the database.');
});

// view engine setup
app.engine('.html', ejs.__express);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');

// uncomment after placing your favicon in /public
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(flash());
app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(session({
    resave: false, 
    saveUninitialized: false,
    secret : config.cookieSecret,
    store : new MongoStore({
        db : config.database.connection.database
    }),
    key : config.database.connection.database,//cookie name
    cookie : {
        maxAge : 1000 * 60 * 60 * 24 * 30
    }
}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(passport.initialize());
app.use(passport.session());

/// add routers definitions here:
var indexRoute = require('./routes/indexRoute');
var userRoute = require('./routes/userRoute');
var postRoute = require('./routes/postRoute');
 
app.get('/', function(req, res) {
    res.redirect('/homepage');
});
app.use(indexRoute());
app.use(userRoute());
app.use(postRoute());

/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;

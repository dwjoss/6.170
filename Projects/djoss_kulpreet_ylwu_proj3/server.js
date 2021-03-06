/*
  Author: Kulpreet
*/

var express = require('express.io');
var session = require('express-session')
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var mongo = require('mongodb');
var mongoose = require('mongoose');

var connection_string = 'mongodb://localhost:27017/ytj';

if (process.env.OPENSHIFT_MONGODB_DB_PASSWORD) {
  connection_string = 'mongodb://' + process.env.OPENSHIFT_MONGODB_DB_USERNAME + ':' +
        process.env.OPENSHIFT_MONGODB_DB_PASSWORD + '@' +
        process.env.OPENSHIFT_MONGODB_DB_HOST + ':' +
        process.env.OPENSHIFT_MONGODB_DB_PORT + '/ytj';
}

mongoose.connect(connection_string);

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'Mongoose Connection Error:'));

var model = require('./data/model');

var routes = require('./routes/index');
var auth = require('./routes/auth');
var api = require('./routes/api');

var app = express();
app.http().io();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({ secret: '4m6s#3@vm)if2o85#e+lr^do5oem#ct(@!(bem_d1y!gks_8^#' }));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(
  function(username, password, done) {
    model.User.findOne({ email: username }, function (err, user) {
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      if (!user.validPassword(password)) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      return done(null, user);
    });
  }
));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  model.User.findById(id, function(err, user) {
    done(err, user);
  });
});

app.use('/', routes);
app.use('/auth', auth);
app.use('/api', api);

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

// Handle case where participant leaves room by closing browser.
// There's a bug in Express.io that prevents cookies from being
// updated in the same session, so a page refresh is required
// for a participant to be removed from a room.
app.io.route('disconnect', function(req) {
	var cookie = require('cookie');
	var roomID = req.headers.referer.split('/').slice(-1)[0];
	var cookies = cookie.parse(req.headers.cookie);
	if (!(cookies.userName === undefined)) {
	    model.Room.findByIdAndUpdate(
	        roomID,  
	        {$pull: {listeners: cookies.userName}},
	        function(err, room) {
	            if (err || !room) { return }
	            req.io.broadcast('users', {room: room._id, listeners: room.listeners});
	        }
	    );
	}
});

var port = process.env.OPENSHIFT_NODEJS_PORT;
var ip = process.env.OPENSHIFT_NODEJS_IP;

var debug = require('debug')('ytj');

app.set('port', port || 3000);

var server = app.listen(app.get('port'), ip, function() {
 debug('Express server listening on port ' + server.address().port);
});

module.exports = app;

'use strict';

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var cookieSession = require('cookie-session');
var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth20');
require('dotenv').config();

var routes = require('./routes/index');
var users = require('./routes/users');
var oauth = require('./routes/oauth');
var groups = require('./routes/groups');
var topics = require('./routes/topics');

var app = express();

//initialize passport
app.use(passport.initialize());
app.use(passport.session());

// view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(favicon(path.join(__dirname, 'public/images', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);

passport.serializeUser(function(user, done) {
    //later this will be where you selectively send to the browser an identifier for your user, like their primary key from the database, or their ID from linkedin
    done(null, user);
});

passport.deserializeUser(function(obj, done) {
    //here is where you will go to the database and get the user each time from it's id, after you set up your db
    done(null, obj);
});

passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "/oauth/google/callback"
    },
    function(accessToken, refreshToken, profile, cb) {
        // TODO ADD IN OUR DATABASE CODE HERE THAT DOES A findORCreate-LIKE FUNCTION.
        // User.findOrCreate({ googleId: profile.id }, function (err, user) {
        console.log(profile);
        // });

        return cb(null, profile);
    }
));

app.use('/oauth', oauth);

app.use('/users', users);

// app.use('/oauth2callback', oauth);
// app.use('/groups', groups);
// app.use('/topics', topics);



// back from google with info
// query database for username
// -/users/usercheck
// if user exists then go to user home page
// -/users/username
// if user does not exist then add to database and go to user home page
// -/users/username
// view groups
// -/users/username/groups
// view topics
// -/users/username/topics
// add group
// -/groups/new
// add topic
// -/topics/new
// edit group
// -/groups/edit
// edit topic
// -/topics/edit
// delete group
// -/groups/delete
// delete topic
// -/topics/delete
// logout
//-/logout

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


module.exports = app;

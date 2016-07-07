'use strict';

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var ejs = require('ejs');
var knex = require('./db/knex');
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

var googleLoginURI = 'https://accounts.google.com/o/oauth2/v2/auth?scope=email&redirect_uri=' + process.env.MAIN_PATH + '/oauth/google/callback&response_type=code&client_id=239915542940-nqg4llnk3ghpa70qudala8fepofgef5o.apps.googleusercontent.com';

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
    //later this will be where you selectively send to the browser an identifier for your user, like their primary key from the database, or their ID from Google
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
        console.log('\nINCOMING PROFILE IS:\n', profile, '\nEND INCOMING PROFILE\n');
        //simplify some data
        var emailAddress = profile.emails[0].value;
        var userName = emailAddress.substring(0, emailAddress.indexOf('@'));

        //make new, optimized profile
        var optimizedProfile = {
            username: userName,
            display_name: profile.displayName,
            first_name: profile.name.givenName,
            last_name: profile.name.familyName,
            user_image: profile.photos[0].value,
            email: emailAddress,
            accessToken: accessToken,
            refreshToken: refreshToken
        };
        console.log('OPTIMIZED PROFILE IS:\n', optimizedProfile, '\nEND OPTIMIZED PROFILE\n');
        //set profile to optimizedProfile
        profile = optimizedProfile;
        console.log('OUTGOING PROFILE IS:\n', profile, '\nEND OUTGOING PROFILE\n');
        //databasefunction that finds an existing user or creates a new one.
        findOrCreate(profile, function(err, user) {
            console.log('\nERROR or USER =\n', err || user, '\n');
            return cb(null, user);
        });

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

function findOrCreate(profile, cb) {
    knex('users').where({
            username: profile.username
        })
        .then(function(data) {
            console.log('\ndata IN findOrCreate 1st .then is:\n', data);
            if (data.length === 1) {
                console.log('\nUser Match Found\n', data[0]);
                //TODO return user profile data
                cb(null, profile);
            } else if (data.length <= 0) {
                console.log('\nNo User Found, Creating\n', data);
                //TODO make new user in DB and return user profile data
                var userObj = {
                    username: data[0].username,
                    display_name: data[0].display_name,
                    first_name: data[0].first_name,
                    last_name: data[0].last_name,
                    user_image: data[0].user_image,
                    email: data[0].email
                };
                knex('users').insert(userObj);
                cb(null, profile);
            }
        }).catch(function(error) {
            console.log('\nNo User Found or Created\n', error);
            cb(error);
        });
}







module.exports = app;

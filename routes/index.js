'use strict';

var express = require('express');
var router = express.Router();
require('dotenv').config();
var googleLoginURI = 'https://accounts.google.com/o/oauth2/v2/auth?scope=email%20profile&state=login&redirect_uri=' + process.env.MAIN_PATH + '/oauth/google/callback&response_type=code&client_id=239915542940-nqg4llnk3ghpa70qudala8fepofgef5o.apps.googleusercontent.com';

/* GET home page. */
router.get('/', function(req, res, next) {
console.log('GOT TO /!!!');
    res.render('index', {
        title: 'Grokkit',
        url: googleLoginURI
    });
});

//dummy route
router.get('/loggedin', function(req, res, next) {
  res.render('loggedin');
});

//dummy route
router.get('/newgroup', function(req, res, next) {
  res.render('newgroup');
});

//dummy route
router.get('/rate', function(req, res, next) {
  res.render('rate');
});

//dummy route
router.get('/newtopic', function(req, res, next) {
  res.render('newtopic');
});

//dummy route
router.get('/viewtopic', function(req, res, next) {
  res.render('viewtopic');
});

module.exports = router;

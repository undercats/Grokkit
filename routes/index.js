'use strict';

var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
console.log('GOT TO /!!!');
    res.render('index', {
        title: 'Grokkit'
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

module.exports = router;

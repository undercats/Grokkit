'use strict';

var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {

    res.render('index', {
        title: 'Express'
    });
});

//dummy route
router.get('/loggedin', function(req, res, next) {

  res.render('loggedin');
});


module.exports = router;

'use strict';

var express = require('express');
var router = express.Router();
var knex = require('../db/knex');


// back from google with info
// query database for username
// /usercheck

// if user exists then go to user home page
// /username
router.get('/:username', function(req, res, next){
  knex('users').where('username', req.params.username).then(function(data){
    res.send(data[0]);
  });
});

// if user does not exist then add to database and go to user home page
// /username

// view groups
// /username/groups

// view topics
// /username/topics

router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;

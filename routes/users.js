'use strict';

var express = require('express');
var router = express.Router();


// back from google with info
// query database for username
// /usercheck

// if user exists then go to user home page
// /username

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

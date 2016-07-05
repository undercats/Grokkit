'use strict';

var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
    onSignIn(googleUser);

  res.render('index');
});


function onSignIn(googleUser) {
var profile = googleUser.getBasicProfile();
console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
console.log('Name: ' + profile.getName());
console.log('Image URL: ' + profile.getImageUrl());
console.log('Email: ' + profile.getEmail());
}


module.exports = router;

'use strict';

var express = require('express');
var router = express.Router();
var passport = require('passport');



router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  function(req, res) {
    // Successful authentication, redirect home.
    // console.log('SESSION IS', req.session);
    var currentUser = req.session.passport.user.username;
    res.redirect('/users/'+ currentUser);
    //temp res.send for
    // res.send('OAUTH SIGNIN WORKED!')
  });

//? DO we want to do a logout button?
// router.get('/logout', function(req, res){
//   req.logout();
//   res.redirect('/');
// });


module.exports = router;

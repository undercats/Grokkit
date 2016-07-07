'use strict';

var express = require('express');
var router = express.Router();
var passport = require('passport');



router.get('/google/callback', function(req, res, next){
// passport.authenticate('google', { failureRedirect: '/' }),
// function(req, res) {
//     console.log('');
//   // Successful authentication, redirect home.
//   // console.log('SESSION IS', req.session);
//   var currentUser = req.session.passport.user.username;
//   res.redirect('/users/'+ currentUser);
//   //temp res.send for
//   // res.send('OAUTH SIGNIN WORKED!')

passport.authenticate('google', function(err, user, info) {
    if (err) {
        console.log('passport.auth ERR', err);
        return next(err);
    }
    if (!user) {
        console.log('passport.auth NO USER');
        return res.redirect('/');
    }
    req.logIn(user, function(err) {
        if (err) {
            console.log('req.login ERR', err);
            return next(err);
        }
        console.log('finally');
        return res.redirect('/users/' + user.username);
    });
})(req, res, next);
});
//? DO we want to do a logout button?
// router.get('/logout', function(req, res){
//   req.logout();
//   res.redirect('/');
// });


module.exports = router;

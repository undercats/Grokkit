'use strict';

var express = require('express');
var router = express.Router();
var passport = require('passport');


router.get('/google',
    passport.authenticate('google', {
        scope: ['email', 'profile']
    }));


router.get('/google/callback', function(req, res, next) {
    console.log('google callback');
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
            console.log(user[0].username);
            return res.redirect('/users/' + user[0].username);
        });
    })(req, res, next);
});
//? DO we want to do a logout button?
// router.get('/logout', function(req, res){
//   req.logout();
//   res.redirect('/');
// });


module.exports = router;

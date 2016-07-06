'use strict';

var express = require('express');
var router = express.Router();



router.get('/', function(req, res, next) {

    console.log(req);

});


function saveLocal() {
    var queryStartLocation = (window.location.href.indexOf('?'));
    var input = window.location.href.slice(queryStartLocation + 1).split('&');
    console.log(input);
    for (var i = 0; i < input.length; i++) {
        input[i] = input[i].split('=');
        localStorage.setItem(input[i][0], input[i][1]);
    }
}


module.exports = router;

'use strict';

var express = require('express');
var router = express.Router();
var knex = require('knex');
var config = require('../knexfile');
require('dotenv').config();
var environment = process.env.NODE_ENV || 'development';
var db = knex(config[environment]);
var checkit = require('checkit');




// back from google with info
// query database for username
// /usercheck

// if user exists then go to user home page
// /username
router.get('/:username', function(req, res, next) {

    // console.log('req.params =\n', req.params || 'error');
    // console.log('req.session =\n', req.session.passport.user || 'error');
    var session = req.session;
    var isArray = session.constructor === Array;
    if (isArray) {
        console.log('SESSION IS ARRAY');
        if (req.session[0].user.username === req.params.username) {
            var newData = [];
            var userInfo = {};
            db('users').where('username', req.params.username).then(function(data) {
                    userInfo.userId = data[0].id;
                    userInfo.userName = data[0].username;
                    userInfo.userImage = data[0].user_image;
                    userInfo.firstName = data[0].first_name;
                    userInfo.lastName = data[0].last_name;
                    userInfo.displayName = data[0].display_name;
                }).then(function() {
                    db('users_groups')
                        .leftJoin('users', 'users_groups.user_id', '=', 'users.id')
                        .leftJoin('groups', 'users_groups.group_id', '=', 'groups.id')
                        .leftJoin('topics', 'topics.group_id', '=', 'groups.id')
                        .leftJoin('groks', 'groks.topic_id', '=', 'topics.id')
                        .select('users.id as user_id', 'username', 'user_image', 'is_leader', 'groups.id as group_id', 'groups.title as group_title', 'groups.description as group_description', 'topics.id as topic_id', 'topics.title as topic_title', 'topics.description as topic_description', 'topics.created_at as topic_created_at', 'is_old', 'groks.rating', 'groks.comment', 'groks.created_at as grok_created_at', 'leader_editable_only', 'display_name', 'first_name', 'last_name')
                        .where('users.username', req.params.username).orderBy('group_id').orderBy('topic_id').then(function(data) {
                            if (data.length > 0) {

                                var groupCollector = [];
                                var counter = 0;
                                var counter2;
                                for (var i = 0; i < data.length; i++) {
                                    if (groupCollector.indexOf(data[i].group_id) === -1) {
                                        newData[counter] = {};
                                        newData[counter].title = data[i].group_title;

                                        newData[counter].description = data[i].group_description;
                                        newData[counter].isLeader = data[i].is_leader;
                                        newData[counter].leaderEditableOnly = data[i].leader_editable_only;
                                        newData[counter].topics = [];
                                        newData[counter].groupId = data[i].group_id;
                                        groupCollector.push(data[i].group_id);
                                        counter++;
                                        counter2 = 0;
                                    }
                                    if (newData[counter - 1].topics.length === 0 || newData[counter - 1].topics[newData[counter - 1].topics.length - 1].topicId !== data[i].topic_id) {
                                        newData[counter - 1].topics[counter2] = {
                                            topicId: data[i].topic_id,
                                            title: data[i].topic_title,
                                            description: data[i].topic_description,
                                            topic_created_at: data[i].topic_created_at,
                                            is_old: data[i].is_old,
                                            ratings: [],
                                            commentCount: 0
                                        };
                                        counter2++;
                                    }
                                    if (data[i].rating) {
                                        newData[counter - 1].topics[counter2 - 1].ratings.push(data[i].rating);
                                    }
                                    if (data[i].comment) {
                                        newData[counter - 1].topics[counter2 - 1].commentCount++;
                                    }
                                    for (var j = 0; j < newData.length; j++) {
                                        for (var k = 0; k < newData[j].topics.length; k++) {
                                            var ratingsTotal = 0;
                                            for (var l = 0; l < newData[j].topics[k].ratings.length; l++) {
                                                ratingsTotal += newData[j].topics[k].ratings[l];
                                            }
                                            newData[j].topics[k].myRating = null;
                                            newData[j].topics[k].ratingAverage = Number((ratingsTotal / newData[j].topics[k].ratings.length).toFixed(2));
                                        }
                                    }
                                }
                            }


                            db('groks').where('user_id', userInfo.userId).then(function(data) {
                                console.log(data);
                                for (var i = 0; i < data.length; i++) {
                                    var topic = data[i].topic_id;
                                    for (var j = 0; j < newData.length; j++) {
                                        for (var k = 0; k < newData[j].topics.length; k++) {
                                            if (newData[j].topics[k].topicId === topic) {
                                                newData[j].topics[k].myRating = data[i].rating;
                                            }
                                        }
                                    }
                                }
                                var allData = {
                                    userInfo: userInfo,
                                    newData: newData
                                };
                                res.render('loggedin', allData);
                            });


                        });
                })
                .catch(function(err) {
                    next(new Error(err));
                });
        } else {
            // res.redirect('/');
            res.send('Username in session did not match username in params.');
        }
    } else {
        console.log('SESSION IS NOT ARRAY');
        console.log('req.session.passport.user.username is:\n', req.session.passport.user.username);
        console.log('req.params.username is:\n', req.params.constructor, req.params);
        if (req.params.username) {
            console.log('req.params.username is true');
            console.log('r.s.p.user[0] = ', req.session.passport.user[0]);
            if (req.session.passport.user[0].username === req.params.username) {
                var newData = [];
                var userInfo = {};
                db('users').where('username', req.params.username).then(function(data) {
                        userInfo.userId = data[0].id;
                        userInfo.userName = data[0].username;
                        userInfo.userImage = data[0].user_image;
                        userInfo.firstName = data[0].first_name;
                        userInfo.lastName = data[0].last_name;
                        userInfo.displayName = data[0].display_name;
                    }).then(function() {
                        db('users_groups')
                            .leftJoin('users', 'users_groups.user_id', '=', 'users.id')
                            .leftJoin('groups', 'users_groups.group_id', '=', 'groups.id')
                            .leftJoin('topics', 'topics.group_id', '=', 'groups.id')
                            .leftJoin('groks', 'groks.topic_id', '=', 'topics.id')
                            .select('users.id as user_id', 'username', 'user_image', 'is_leader', 'groups.id as group_id', 'groups.title as group_title', 'groups.description as group_description', 'topics.id as topic_id', 'topics.title as topic_title', 'topics.description as topic_description', 'topics.created_at as topic_created_at', 'is_old', 'groks.rating', 'groks.comment', 'groks.created_at as grok_created_at', 'leader_editable_only', 'display_name', 'first_name', 'last_name')
                            .where('users.username', req.params.username).orderBy('group_id').orderBy('topic_id').then(function(data) {
                                if (data.length > 0) {

                                    var groupCollector = [];
                                    var counter = 0;
                                    var counter2;
                                    for (var i = 0; i < data.length; i++) {
                                        if (groupCollector.indexOf(data[i].group_id) === -1) {
                                            newData[counter] = {};
                                            newData[counter].title = data[i].group_title;

                                            newData[counter].description = data[i].group_description;
                                            newData[counter].isLeader = data[i].is_leader;
                                            newData[counter].leaderEditableOnly = data[i].leader_editable_only;
                                            newData[counter].topics = [];
                                            newData[counter].groupId = data[i].group_id;
                                            groupCollector.push(data[i].group_id);
                                            counter++;
                                            counter2 = 0;
                                        }
                                        if (newData[counter - 1].topics.length === 0 || newData[counter - 1].topics[newData[counter - 1].topics.length - 1].topicId !== data[i].topic_id) {
                                            newData[counter - 1].topics[counter2] = {
                                                topicId: data[i].topic_id,
                                                title: data[i].topic_title,
                                                description: data[i].topic_description,
                                                topic_created_at: data[i].topic_created_at,
                                                is_old: data[i].is_old,
                                                ratings: [],
                                                commentCount: 0
                                            };
                                            counter2++;
                                        }
                                        if (data[i].rating) {
                                            newData[counter - 1].topics[counter2 - 1].ratings.push(data[i].rating);
                                        }
                                        if (data[i].comment) {
                                            newData[counter - 1].topics[counter2 - 1].commentCount++;
                                        }
                                        for (var j = 0; j < newData.length; j++) {
                                            for (var k = 0; k < newData[j].topics.length; k++) {
                                                var ratingsTotal = 0;
                                                for (var l = 0; l < newData[j].topics[k].ratings.length; l++) {
                                                    ratingsTotal += newData[j].topics[k].ratings[l];
                                                }
                                                newData[j].topics[k].myRating = null;
                                                newData[j].topics[k].ratingAverage = Number((ratingsTotal / newData[j].topics[k].ratings.length).toFixed(2));
                                            }
                                        }
                                    }
                                }


                                db('groks').where('user_id', userInfo.userId).then(function(data) {
                                    console.log(data);
                                    for (var i = 0; i < data.length; i++) {
                                        var topic = data[i].topic_id;
                                        for (var j = 0; j < newData.length; j++) {
                                            for (var k = 0; k < newData[j].topics.length; k++) {
                                                if (newData[j].topics[k].topicId === topic) {
                                                    newData[j].topics[k].myRating = data[i].rating;
                                                }
                                            }
                                        }
                                    }
                                    var allData = {
                                        userInfo: userInfo,
                                        newData: newData
                                    };
                                    res.render('loggedin', allData);
                                });


                            });
                    })
                    .catch(function(err) {
                        next(new Error(err));
                    });
            } else if (req.session.passport.user.username === req.params.username) {
                var newData = [];
                var userInfo = {};
                db('users').where('username', req.params.username).then(function(data) {
                        userInfo.userId = data[0].id;
                        userInfo.userName = data[0].username;
                        userInfo.userImage = data[0].user_image;
                        userInfo.firstName = data[0].first_name;
                        userInfo.lastName = data[0].last_name;
                        userInfo.displayName = data[0].display_name;
                    }).then(function() {
                        db('users_groups')
                            .leftJoin('users', 'users_groups.user_id', '=', 'users.id')
                            .leftJoin('groups', 'users_groups.group_id', '=', 'groups.id')
                            .leftJoin('topics', 'topics.group_id', '=', 'groups.id')
                            .leftJoin('groks', 'groks.topic_id', '=', 'topics.id')
                            .select('users.id as user_id', 'username', 'user_image', 'is_leader', 'groups.id as group_id', 'groups.title as group_title', 'groups.description as group_description', 'topics.id as topic_id', 'topics.title as topic_title', 'topics.description as topic_description', 'topics.created_at as topic_created_at', 'is_old', 'groks.rating', 'groks.comment', 'groks.created_at as grok_created_at', 'leader_editable_only', 'display_name', 'first_name', 'last_name')
                            .where('users.username', req.params.username).orderBy('group_id').orderBy('topic_id').then(function(data) {
                                if (data.length > 0) {

                                    var groupCollector = [];
                                    var counter = 0;
                                    var counter2;
                                    for (var i = 0; i < data.length; i++) {
                                        if (groupCollector.indexOf(data[i].group_id) === -1) {
                                            newData[counter] = {};
                                            newData[counter].title = data[i].group_title;

                                            newData[counter].description = data[i].group_description;
                                            newData[counter].isLeader = data[i].is_leader;
                                            newData[counter].leaderEditableOnly = data[i].leader_editable_only;
                                            newData[counter].topics = [];
                                            newData[counter].groupId = data[i].group_id;
                                            groupCollector.push(data[i].group_id);
                                            counter++;
                                            counter2 = 0;
                                        }
                                        if (newData[counter - 1].topics.length === 0 || newData[counter - 1].topics[newData[counter - 1].topics.length - 1].topicId !== data[i].topic_id) {
                                            newData[counter - 1].topics[counter2] = {
                                                topicId: data[i].topic_id,
                                                title: data[i].topic_title,
                                                description: data[i].topic_description,
                                                topic_created_at: data[i].topic_created_at,
                                                is_old: data[i].is_old,
                                                ratings: [],
                                                commentCount: 0
                                            };
                                            counter2++;
                                        }
                                        if (data[i].rating) {
                                            newData[counter - 1].topics[counter2 - 1].ratings.push(data[i].rating);
                                        }
                                        if (data[i].comment) {
                                            newData[counter - 1].topics[counter2 - 1].commentCount++;
                                        }
                                        for (var j = 0; j < newData.length; j++) {
                                            for (var k = 0; k < newData[j].topics.length; k++) {
                                                var ratingsTotal = 0;
                                                for (var l = 0; l < newData[j].topics[k].ratings.length; l++) {
                                                    ratingsTotal += newData[j].topics[k].ratings[l];
                                                }
                                                newData[j].topics[k].myRating = null;
                                                newData[j].topics[k].ratingAverage = Number((ratingsTotal / newData[j].topics[k].ratings.length).toFixed(2));
                                            }
                                        }
                                    }
                                }


                                db('groks').where('user_id', userInfo.userId).then(function(data) {
                                    console.log(data);
                                    for (var i = 0; i < data.length; i++) {
                                        var topic = data[i].topic_id;
                                        for (var j = 0; j < newData.length; j++) {
                                            for (var k = 0; k < newData[j].topics.length; k++) {
                                                if (newData[j].topics[k].topicId === topic) {
                                                    newData[j].topics[k].myRating = data[i].rating;
                                                }
                                            }
                                        }
                                    }
                                    var allData = {
                                        userInfo: userInfo,
                                        newData: newData
                                    };
                                    res.render('loggedin', allData);
                                });


                            });
                    })
                    .catch(function(err) {
                        next(new Error(err));
                    });
            } else {
                res.redirect('/');
            }
        } else {
            res.render('req.params.username was false');
        }

    }

});

// if user does not exist then add to database and go to user home page
// /username

// view groups
// /username/groups

router.get('/:username/topics/:topic_id', function(req, res, next) {
    var newData = {};
    db('topics')
        .join('users_groups', 'topics.group_id', '=', 'users_groups.group_id')
        .join('users', 'users.id', '=', 'users_groups.user_id')
        .where('topics.id', req.params.topic_id).where('users.username', req.params.username)
        .then(function(data) {
            newData.userId = data[0].id;
            newData.username = data[0].username;
            newData.userImage = data[0].user_image;
            newData.firstName = data[0].first_name;
            newData.lastName = data[0].last_name;
            newData.displayName = data[0].display_name;
            newData.isLeader = data[0].is_leader;
            newData.topicTitle = data[0].title;
            newData.topicDescription = data[0].description;
            newData.topicId = req.params.topic_id;
            newData.groupId = data[0].group_id;

        }).then(function() {
            if (newData.isLeader) {
                db('groks')
                    .join('users', 'groks.user_id', '=', 'users.id')
                    .where('groks.topic_id', req.params.topic_id)
                    .then(function(data) {
                        if (data.length > 0) {
                            newData.ratings = [];
                            var counter = 0;
                            for (var i = 0; i < data.length; i++) {
                                newData.ratings[i] = {};
                                newData.ratings[i].rating = data[i].rating;
                                newData.ratings[i].comment = data[i].comment;
                                newData.ratings[i].commentBy = data[i].username;
                                counter += data[i].rating;
                            }
                            newData.avgRating = Number(counter / data.length.toFixed(2));
                            newData.stringified = JSON.stringify(newData);
                        } else {
                            newData.ratings = null;
                            newData.stringified = JSON.stringify({});
                        }
                        res.render('viewtopic', newData);

                    });
            } else {
                db('groks')
                    .join('users', 'groks.user_id', '=', 'users.id')
                    .where('username', req.params.username).where('groks.topic_id', req.params.topic_id)
                    .then(function(data) {
                        if (data.length > 0) {
                            newData.myRating = data[0].rating;
                            newData.myComment = data[0].comment;
                        } else {
                            newData.myRating = null;
                            newData.myComment = null;
                        }
                        var allData = {
                            newData: newData,
                            err: null
                        };
                        res.render('rate', allData);
                    });
            }

        }).catch(function(err) {
            next(new Error(err));
        });
});

router.get('/:username/groups/new', function(req, res, next) {
    var userInfo;
    db('users').where('username', req.params.username).then(function(data) {
        userInfo = {
            username: data[0].username,
            firstName: data[0].first_name,
            lastName: data[0].last_name,
            userImage: data[0].user_image,
            displayName: data[0].display_name,
            userId: data[0].id
        };
    }).then(function() {
        db('users').whereNot('username', req.params.username).select('id as user_id', 'username', 'email', 'first_name', 'last_name', 'user_image', 'display_name').orderBy('username').then(function(data) {
            var newData = {
                userInfo: userInfo,
                userList: data
            };
            // console.log(newData);
            newData.err = null;
            res.render('newgroup', newData);
        });
    }).catch(function(err) {
        next(new Error(err));
    });
});

router.get('/:username/groups/:group_id/newtopic', function(req, res, next) {
    var newData;
    db('users')
        .join('users_groups', 'users.id', '=', 'users_groups.user_id')
        .join('groups', 'groups.id', '=', 'users_groups.group_id')
        .where('username', req.params.username).where('groups.id', req.params.group_id)
        .then(function(data) {
            newData = {
                editType: 'new',
                username: data[0].username,
                firstName: data[0].first_name,
                lastName: data[0].last_name,
                userImage: data[0].user_image,
                displayName: data[0].display_name,
                isLeader: data[0].is_leader,
                groupId: data[0].group_id,
                groupTitle: data[0].title,
                groupDescription: data[0].description,
                leaderEditableOnly: data[0].leader_editable_only
            };
            var allData = {
                newData: newData,
                err: null
            };
            res.render('newtopic', allData);
        }).catch(function(err) {
            next(new Error(err));
        });
});

router.get('/:username/groups/edit/:group_id', function(req, res, next) {
    var newData = {};
    db('users')
        .join('users_groups', 'users.id', '=', 'users_groups.user_id')
        .join('groups', 'groups.id', '=', 'users_groups.group_id')
        .where('username', req.params.username).where('groups.id', req.params.group_id)
        .then(function(data) {
            newData.userInfo = {
                editType: 'edit',
                username: data[0].username,
                firstName: data[0].first_name,
                lastName: data[0].last_name,
                userImage: data[0].user_image,
                displayName: data[0].display_name,
                isLeader: data[0].is_leader,
                groupId: data[0].group_id,
                groupTitle: data[0].title,
                groupDescription: data[0].description,
                leaderEditableOnly: data[0].leader_editable_only
            };

        }).then(function() {
            db('users')
                .orderBy('username').then(function(data) {
                    newData.userList = data;
                    db('users_groups')
                        .where('users_groups.group_id', req.params.group_id).then(function(data) {
                            for (var i = 0; i < newData.userList.length; i++) {
                                newData.userList[i].user_id = newData.userList[i].id;
                                console.log(newData.userList[i]);
                                newData.userList[i].is_leader = undefined;
                                for (var j = 0; j < data.length; j++) {
                                    if (newData.userList[i].id === data[j].user_id) {
                                        newData.userList[i].is_leader = data[j].is_leader;
                                    }
                                }
                            }
                            newData.err = null;
                            res.render('newgroup', newData);
                        });
                });
        }).catch(function(err) {
            next(new Error(err));
        });
});

router.post('/:username/groups/new', function(req, res, next) {
    var check = new checkit({
        title: ['required', 'maxLength:255'],
        description: ['required', 'maxLength:255']
    });
    check.run(req.body).then(function(validated) {}).then(function() {
        var leaderEditableOnly = true;
        if (req.body.permissions === 'user') {
            leaderEditableOnly = false;
        }

        db('groups').insert({
            title: req.body.title,
            description: req.body.description,
            leader_editable_only: leaderEditableOnly
        }).returning('id').then(function(data) {
            var userArray = [];
            userArray.push({
                user_id: Number(req.body.userId),
                group_id: Number(data[0]),
                is_leader: true
            });
            var wrongArray = ['title', 'permissions', 'description', 'userId'];
            var isLeader = false;
            for (var key in req.body) {

                if (wrongArray.indexOf(key) === -1) {
                    if (req.body[key] === 'leader') {
                        isLeader = true;
                    }
                    if (req.body[key] !== 'none') {
                        userArray.push({
                            user_id: Number(key),
                            group_id: Number(data[0]),
                            is_leader: isLeader
                        });
                    }

                }
            }
            db('users_groups').insert(userArray).then(function() {
                res.redirect('/users/' + req.params.username);
            });
        }).catch(function(err) {
            next(new Error(err));
        });

    }).catch(function(err) {
        var userInfo;
        db('users').where('username', req.params.username).then(function(data) {
            userInfo = {
                username: data[0].username,
                firstName: data[0].first_name,
                lastName: data[0].last_name,
                userImage: data[0].user_image,
                displayName: data[0].display_name,
                userId: data[0].id
            };
        }).then(function() {
            db('users').whereNot('username', req.params.username).select('id as user_id', 'username', 'email', 'first_name', 'last_name', 'user_image', 'display_name').orderBy('username').then(function(data) {
                var newData = {
                    userInfo: userInfo,
                    userList: data,
                    err: err.errors
                };
                // console.log(newData);
                console.log(newData.err);
                res.render('newgroup', newData);
            });
        });

    });
});

router.post('/:username/topics/:topic_id', function(req, res, next) {
    var check = new checkit({
        comment: 'maxLength:255'
    });
    check.run(req.body).then(function(validated) {
        console.log(req.body);
        var insertObj = {};
        insertObj.user_id = Number(req.body.userId);
        insertObj.topic_id = req.params.topic_id;
        insertObj.comment = req.body.comment || null;

        if (req.body.rating !== 'null') {
            insertObj.rating = req.body.rating;
        }

        db('groks').insert(insertObj).then(function() {
            res.redirect('/users/' + req.params.username);
        }).catch(function(err) {
            next(new Error(err));
        });
    }).catch(function(err) {
        var newData = {};
        db('topics')
            .join('users_groups', 'topics.group_id', '=', 'users_groups.group_id')
            .join('users', 'users.id', '=', 'users_groups.user_id')
            .where('topics.id', req.params.topic_id).where('users.username', req.params.username)
            .then(function(data) {
                newData.userId = data[0].id;
                newData.username = data[0].username;
                newData.userImage = data[0].user_image;
                newData.firstName = data[0].first_name;
                newData.lastName = data[0].last_name;
                newData.displayName = data[0].display_name;
                newData.isLeader = data[0].is_leader;
                newData.topicTitle = data[0].title;
                newData.topicDescription = data[0].description;
                newData.topicId = req.params.topic_id;
                newData.groupId = data[0].group_id;

            }).then(function() {
                db('groks')
                    .join('users', 'groks.user_id', '=', 'users.id')
                    .where('username', req.params.username).where('groks.topic_id', req.params.topic_id)
                    .then(function(data) {
                        if (data.length > 0) {
                            newData.myRating = data[0].rating;
                            newData.myComment = data[0].comment;
                            console.log(newData);
                        } else {
                            newData.myRating = null;
                            newData.myComment = null;
                            console.log(newData);

                        }
                        var allData = {
                            newData: newData,
                            err: err.errors
                        };
                        res.render('rate', allData);
                    });


            }).catch(function(err) {
                next(new Error(err));
            });
    });

});

router.post('/:username/topics/edit/:topic_id', function(req, res, next) {
    var check = new checkit({
        comment: 'maxLength:255'
    });
    check.run(req.body).then(function(validated) {
        var comment = req.body.comment || null;
        db('groks').where('user_id', Number(req.body.userId)).where('topic_id', req.params.topic_id).update({
            rating: req.body.rating,
            comment: comment
        }).then(function() {
            res.redirect('/users/' + req.params.username);
        }).catch(function(err) {
            next(new Error(err));
        });
    }).catch(function(err) {
        var newData = {};
        db('topics')
            .join('users_groups', 'topics.group_id', '=', 'users_groups.group_id')
            .join('users', 'users.id', '=', 'users_groups.user_id')
            .where('topics.id', req.params.topic_id).where('users.username', req.params.username)
            .then(function(data) {
                newData.userId = data[0].id;
                newData.username = data[0].username;
                newData.userImage = data[0].user_image;
                newData.firstName = data[0].first_name;
                newData.lastName = data[0].last_name;
                newData.displayName = data[0].display_name;
                newData.isLeader = data[0].is_leader;
                newData.topicTitle = data[0].title;
                newData.topicDescription = data[0].description;
                newData.topicId = req.params.topic_id;
                newData.groupId = data[0].group_id;

            }).then(function() {

                db('groks')
                    .join('users', 'groks.user_id', '=', 'users.id')
                    .where('username', req.params.username).where('groks.topic_id', req.params.topic_id)
                    .then(function(data) {
                        if (data.length > 0) {
                            newData.myRating = data[0].rating;
                            newData.myComment = data[0].comment;
                        } else {
                            newData.myRating = null;
                            newData.myComment = null;
                        }
                        var allData = {
                            newData: newData,
                            err: err.errors
                        };
                        console.log(allData.err);
                        res.render('rate', allData);
                    });


            }).catch(function(err) {
                next(new Error(err));
            });
    });
});

router.post('/:username/groups/:group_id/newtopic', function(req, res, next) {
    var check = new checkit({
        title: ['required', 'maxLength:255'],
        description: ['required', 'maxLength:255']
    });
    check.run(req.body).then(function(validated) {


        db('topics').insert({
                group_id: req.params.group_id,
                title: req.body.title,
                description: req.body.description,
                is_old: false
            })
            .then(function() {
                res.redirect('/users/' + req.params.username);
            }).catch(function(err) {
                next(new Error(err));
            });
    }).catch(function(err) {
        var newData;
        db('users')
            .join('users_groups', 'users.id', '=', 'users_groups.user_id')
            .join('groups', 'groups.id', '=', 'users_groups.group_id')
            .where('username', req.params.username).where('groups.id', req.params.group_id)
            .then(function(data) {
                newData = {
                    editType: 'new',
                    username: data[0].username,
                    firstName: data[0].first_name,
                    lastName: data[0].last_name,
                    userImage: data[0].user_image,
                    displayName: data[0].display_name,
                    isLeader: data[0].is_leader,
                    groupId: data[0].group_id,
                    groupTitle: data[0].title,
                    groupDescription: data[0].description,
                    leaderEditableOnly: data[0].leader_editable_only
                };
                var allData = {
                    newData: newData,
                    err: err.errors
                };
                res.render('newtopic', allData);
            }).catch(function(err) {
                next(new Error(err));
            });
    });
});



router.post('/:username/groups/edit/:group_id', function(req, res, next) {
    var check = new checkit({
        title: ['required', 'maxLength:255'],
        description: ['required', 'maxLength:255']
    });
    check.run(req.body).then(function(validated) {


        var leaderEditableOnly = true;
        if (req.body.permissions === 'user') {
            leaderEditableOnly = false;
        }
        db('groups').where('id', req.params.group_id).update({
            title: req.body.title,
            description: req.body.description,
            leader_editable_only: leaderEditableOnly
        }).returning('id').then(function(data) {
            var userArray = [];
            var deleteArray = [];
            var wrongArray = ['title', 'permissions', 'description', 'userId'];

            for (var key in req.body) {
                var isLeader = false;
                if (wrongArray.indexOf(key) === -1) {
                    if (req.body[key] === 'leader') {
                        isLeader = true;
                    }
                    deleteArray.push(Number(key));
                    if (req.body[key] !== 'none') {
                        userArray.push({
                            user_id: Number(key),
                            group_id: Number(data[0]),
                            is_leader: isLeader
                        });
                    }

                }
            }
            db('users_groups').whereIn('user_id', deleteArray).where('group_id', req.params.group_id).del()
                .then(function() {
                    db('users_groups').insert(userArray).then(function() {

                    });
                })
                .then(function() {
                    res.redirect('/users/' + req.params.username);
                });
        });
    }).catch(function(err) {
        var newData = {};
        db('users')
            .join('users_groups', 'users.id', '=', 'users_groups.user_id')
            .join('groups', 'groups.id', '=', 'users_groups.group_id')
            .where('username', req.params.username).where('groups.id', req.params.group_id)
            .then(function(data) {
                newData.userInfo = {
                    editType: 'edit',
                    username: data[0].username,
                    firstName: data[0].first_name,
                    lastName: data[0].last_name,
                    userImage: data[0].user_image,
                    displayName: data[0].display_name,
                    isLeader: data[0].is_leader,
                    groupId: data[0].group_id,
                    groupTitle: data[0].title,
                    groupDescription: data[0].description,
                    leaderEditableOnly: data[0].leader_editable_only
                };

            }).then(function() {
                db('users')
                    .orderBy('username').then(function(data) {
                        newData.userList = data;
                        db('users_groups')
                            .where('users_groups.group_id', req.params.group_id).then(function(data) {
                                for (var i = 0; i < newData.userList.length; i++) {
                                    newData.userList[i].user_id = newData.userList[i].id;
                                    console.log(newData.userList[i]);
                                    newData.userList[i].is_leader = undefined;
                                    for (var j = 0; j < data.length; j++) {
                                        if (newData.userList[i].id === data[j].user_id) {
                                            newData.userList[i].is_leader = data[j].is_leader;
                                        }
                                    }
                                }
                                newData.err = err.errors;
                                res.render('newgroup', newData);
                            });
                    });
            }).catch(function(err) {
                next(new Error(err));
            });
    });
});

router.delete('/:username/groups/delete/:group_id', function(req, res, next) {
    db('users_groups').where('group_id', req.params.group_id).del().then(function() {
        db('groups').where('id', req.params.group_id).del().then(function() {
            db('topics').where('group_id', req.params.group_id).select('id').then(function(data) {
                var deleteArray = [];
                for (var i = 0; i < data.length; i++) {
                    deleteArray.push(data[i].id);
                }
                db('topics').where('group_id', req.params.group_id).del().then(function() {
                    db('groks').whereIn('topic_id', deleteArray).del().then(function() {
                        res.redirect('/users/' + req.params.username);
                    });
                });
            });
        });
    }).catch(function(err) {
        next(new Error(err));
    });

});

router.delete('/:username/topics/delete/:topic_id', function(req, res, next) {
    db('topics').where('id', req.params.topic_id).del().then(function() {
        db('groks').where('topic_id', req.params.topic_id).del().then(function() {
            res.redirect('/users/' + req.params.username);
        });
    }).catch(function(err) {
        next(new Error(err));
    });
});

module.exports = router;

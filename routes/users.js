'use strict';

var express = require('express');
var router = express.Router();
var knex = require('../db/knex');



// back from google with info
// query database for username
// /usercheck

// if user exists then go to user home page
// /username
router.get('/:username', function(req, res, next) {
    console.log('\nReq params is: ', req.params);
    console.log('\nReq params username is: ', req.params.username);
    console.log('\nReq session is:', req.session);
    if (req.params.username === req.session.passport.user.username) {
        var newData = [];
        var userInfo = {};
        knex('users_groups')
            .leftJoin('users', 'users_groups.user_id', '=', 'users.id')
            .leftJoin('groups', 'users_groups.group_id', '=', 'groups.id')
            .leftJoin('topics', 'topics.group_id', '=', 'groups.id')
            .leftJoin('groks', 'groks.topic_id', '=', 'topics.id')
            .select('users.id as user_id', 'username', 'user_image', 'is_leader', 'groups.id as group_id', 'groups.title as group_title', 'groups.description as group_description', 'topics.id as topic_id', 'topics.title as topic_title', 'topics.description as topic_description', 'topics.created_at as topic_created_at', 'is_old', 'groks.rating', 'groks.comment', 'groks.created_at as grok_created_at', 'leader_editable_only', 'display_name', 'first_name', 'last_name')
            .where('users.username', req.params.username).orderBy('group_id').orderBy('topic_id')
            .then(function(data) {
                // console.log('\n Data is:', data);
                userInfo.userName = data[0].username;
                userInfo.userImage = data[0].user_image;
                userInfo.firstName = data[0].first_name;
                userInfo.lastName = data[0].last_name;
                userInfo.displayName = data[0].display_name;
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
                }
                for (var j = 0; j < newData.length; j++) {
                    for (var k = 0; k < newData[j].topics.length; k++) {
                        var ratingsTotal = 0;
                        for (var l = 0; l < newData[j].topics[k].ratings.length; l++) {
                            ratingsTotal += newData[j].topics[k].ratings[l];
                        }
                        newData[j].topics[k].ratingAverage = Number((ratingsTotal / newData[j].topics[k].ratings.length).toFixed(2));
                    }
                }

            })
            .then(function() {
                var allData = {
                    userInfo: userInfo,
                    newData: newData
                };
                // console.log('\nallData is:', allData);
                // console.log(allData.newData[0].topics);
                res.render('loggedin', allData);
            }).catch(function(err) {
                next(new Error(err));
            });
    } else {
        res.redirect('/');
    }

});

// if user does not exist then add to database and go to user home page
// /username

// view groups
// /username/groups

router.get('/:username/topics/:topic_id', function(req, res, next) {
    var newData = {};
    knex('topics')
        .join('users_groups', 'topics.group_id', '=', 'users_groups.group_id')
        .join('users', 'users.id', '=', 'users_groups.user_id')
        .where('topics.id', req.params.topic_id).where('users.username', req.params.username)
        .then(function(data) {
            newData.username = data[0].username;
            newData.userImage = data[0].user_image;
            newData.firstName = data[0].first_name;
            newData.lastName = data[0].last_name;
            newData.displayName = data[0].display_name;
            newData.isLeader = data[0].is_leader;
            newData.topicTitle = data[0].title;
            newData.topicDescription = data[0].description;

        }).then(function() {
            if (newData.isLeader) {
                knex('groks')
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
                            res.render('viewtopic', newData);
                        } else {
                            newData.ratings = null;
                            res.render('viewtopic', newData);
                        }

                    });
            } else {
                knex('groks')
                    .join('users', 'groks.user_id', '=', 'users.id')
                    .where('username', req.params.username).where('groks.topic_id', req.params.topic_id)
                    .then(function(data) {
                        if (data.length > 0) {
                            newData.myRating = data[0].rating;
                            newData.myComment = data[0].comment;
                            res.render('rate', newData);
                        } else {
                            newData.myRating = null;
                            newData.myComment = null;
                            res.render('rate', newData);
                        }
                    });
            }

        }).catch(function(err) {
            next(new Error(err));
        });
});

router.get('/:username/groups/new', function(req, res, next) {
    var userInfo;
    knex('users').where('username', req.params.username).then(function(data) {
        userInfo = {
            username: data[0].username,
            firstName: data[0].first_name,
            lastName: data[0].last_name,
            userImage: data[0].user_image,
            displayName: data[0].display_name,
            userId: data[0].id
        };
    }).then(function() {
        knex('users').whereNot('username', req.params.username).select('id as user_id', 'username', 'email', 'first_name', 'last_name', 'user_image', 'display_name').orderBy('username').then(function(data) {
            var newData = {
                userInfo: userInfo,
                userList: data
            };
            // console.log(newData);
            res.render('newgroup', newData);
        });
    }).catch(function(err) {
        next(new Error(err));
    });
});

router.get('/:username/groups/:group_id/newtopic', function(req, res, next){
  var newData;
  knex('users')
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
      res.render('newtopic', newData);
  }).catch(function(err) {
      next(new Error(err));
  });
});

router.get('/:username/groups/edit/:group_id', function(req, res, next){
  var newData = {};
  knex('users')
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

  }).then(function(){
    knex('users_groups')
    .join('users', 'users_groups.user_id', '=', 'users.id')
    .where('users_groups.group_id', req.params.group_id)
    .orderBy('username')
    .then(function(data){
      newData.userList = data;
      res.render('newgroup', newData);
  });
  }).catch(function(err) {
      next(new Error(err));
  });
});

router.post('/:username/groups/new', function(req, res, next){
  var leaderEditableOnly = true;
  if(req.body.permissions === 'user'){
    leaderEditableOnly = false;
  }

  knex('groups').insert({title: req.body.title, description: req.body.description, leader_editable_only: leaderEditableOnly}).returning('id').then(function(data){
    var userArray =[];
    userArray.push({user_id: Number(req.body.userId), group_id: Number(data[0]), is_leader: true});
    var wrongArray = ['title', 'permissions', 'description', 'userId'];
    var isLeader = false;
    for(var key in req.body){

      if(wrongArray.indexOf(key) === -1){
        if(req.body[key] === 'leader'){
          isLeader = true;
        }
        if(req.body[key] !== 'none'){
          userArray.push({user_id: Number(key), group_id: Number(data[0]), is_leader: isLeader});
        }

      }
    }
    knex('users_groups').insert(userArray).then(function(){
      res.redirect('/users/' + req.params.username);
    });
  }).catch(function(err) {
      next(new Error(err));
  });
});

router.post('/:username/groups/:group_id/newtopic', function(req, res, next){
  knex('topics').insert({group_id: req.params.group_id, title: req.body.title, description: req.body.description, is_old: false})
  .then(function(){
    res.redirect('/users/' + req.params.username);
  }).catch(function(err) {
      next(new Error(err));
  });
});

module.exports = router;

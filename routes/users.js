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
  var newData = [];
  knex('users_groups')
  .leftJoin('users', 'users_groups.user_id', '=', 'users.id')
  .leftJoin('groups', 'users_groups.group_id', '=', 'groups.id')
  .leftJoin('topics', 'topics.group_id', '=', 'groups.id')
  .leftJoin('groks', 'groks.topic_id', '=', 'topics.id')
  .select('users.id as user_id', 'username', 'user_image', 'is_leader', 'groups.id as group_id', 'groups.title as group_title', 'groups.description as group_description', 'topics.id as topic_id', 'topics.title as topic_title', 'topics.description as topic_description', 'topics.created_at as topic_created_at', 'is_old', 'groks.rating', 'groks.comment', 'groks.created_at as grok_created_at')
  .where('users.username', req.params.username).orderBy('group_id').orderBy('topic_id').then(function(data){
    console.log(data);

    var groupCollector = [];
    var counter = 0;
    var counter2;
    for(var i = 0; i < data.length; i++){
      if(groupCollector.indexOf(data[i].group_id) === -1){
        newData[counter] = {};
        newData[counter].title = data[i].group_title;
        newData[counter].description = data[i].group_description;
        newData[counter].topics = [];
        groupCollector.push(data[i].group_id);
        counter++;
        counter2 = 0;
      }
      if(newData[counter-1].topics.length === 0|| newData[counter-1].topics[newData[counter-1].topics.length-1].topic_id !== data[i].topic_id){
          newData[counter-1].topics[counter2] = {topic_id: data[i].topic_id, title: data[i].topic_title, description: data[i].topic_description, topic_created_at: data[i].topic_created_at, is_old: data[i].is_old, ratings: [], commentCount: 0};
          counter2++;
      }
      if(data[i].rating){
        newData[counter-1].topics[counter2-1].ratings.push(data[i].rating);
      }
      if(data[i].comment){
        newData[counter-1].topics[counter2-1].commentCount++;
      }
      // else if(newData[counter-1].topics[newData[counter-1].topics.length-1].topic_id !== data[i].topic_id){
      //
      // }

    }
    for(var j = 0; j< newData.length;j++){
      for(var k = 0; k < newData[j].topics.length; k++){
        var ratingsTotal = 0;
        for(var l = 0; l < newData[j].topics[k].ratings.length; l++){
          ratingsTotal += newData[j].topics[k].ratings[l];
        }
        newData[j].topics[k].ratingAverage = Number((ratingsTotal / newData[j].topics[k].ratings.length).toFixed(2));
      }
    }
    console.log('New Data =\n', newData, '\n');

  })
  .then(function(){
    res.json(newData);
  });
});

// if user does not exist then add to database and go to user home page
// /username

// view groups
// /username/groups

// view topics
// /username/topics


module.exports = router;

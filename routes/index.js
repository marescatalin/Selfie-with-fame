var express = require('express');
var router = express.Router();
var Users = require('../models/user');

var login = true;

var user1 = {username: 'user1', password: '123', bio: 'bio1'};
var user2 = {username: 'user2', password: '123', bio: 'bio2'};
var users = [];
users[0] = user1;
users[1] = user2;
var myUsers = JSON.stringify(users);

var event1 = {name: 'event1', description:"Just an example event", pictures: [], startDate: new Date(2019,2,10), endDate: new Date(2019,4,20), location: {lat: 53.372900, lng: -1.506912}, keywords: 'key1', user: user1};
var event2 = {name: 'event2', description:"Just an example event", pictures: [], startDate: new Date(2019,2,15), endDate: new Date(2019,5,20), location: {lat: 53.372417, lng: -1.504116}, keywords: 'key2', user: user1};
var events = [];
events[0] = event1;
events[1] = event2;
var myEvents = JSON.stringify(events);

var story1 = {myevent: 'event1', author: 'user1', title: 'story1', message: 'comm1', date: new Date(2019,3,20)};
var story2 = {myevent: 'event1', author: 'user1', title: 'story2', message: 'comm2', date: new Date(2019,3,21)};
var story3 = {myevent: 'event2', author: 'user2', title: 'story3', message: 'comm3', date: new Date(2019,3,22)};
var stories = [];
stories[0] = story1;
stories[1] = story2;
stories[2] = story3;
var myStories = JSON.stringify(stories);



/* GET home page. */
router.get('/map', function(req,res,next) {
  res.render('map', {myStories: myStories, myEvents: myEvents, myUsers: myUsers});
});

router.get('/map', function(req,res,next) {
  res.render('map', {myStories: myStories, myEvents: myEvents, myUsers: myUsers});
});

router.get('/', function(req, res, next) {
  if (login)
    res.render('map', {myStories: myStories, myEvents: myEvents, myUsers: myUsers});
  else
    res.render('index', { title: 'Express', login_is_correct: true });
});

router.get('/signup', function(req, res, next) {
    res.render('signup', {title: 'Express'});
});

router.post('/signup', function (req, res) {
    res.redirect('/map');
});



module.exports = router;

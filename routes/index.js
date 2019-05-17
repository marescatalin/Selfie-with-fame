var express = require('express');
var router = express.Router();
var User = require('../models/user');
var fs = require('fs');

var login = false;

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

var user = require('../controllers/users');
var initDB= require('../controllers/init');
initDB.init();
// user.getUser();


/* GET home page. */
router.post('/map',async function(req,res) {
    user.query(req, res);
});

router.get('/settings', function(req,res,next) {
    user.getUser(req,res)
});

router.get('/map', function(req,res,next) {
    res.render('map', {myStories: myStories, myEvents: myEvents, myUsers: myUsers});
});

router.post('/editaccount', function(req,res,next) {
    user.updateUser(req,res);
});

router.get('/', function(req, res, next) {
    if (req.cookies.permanentSession == undefined && req.cookies.session == undefined ){
        res.render('index', {title: 'Express', username: "", login_is_correct: true});
    }else{
        res.render('map', {myStories: myStories, myEvents: myEvents, myUsers: myUsers});
    }

});

router.get('/signup', function(req, res, next) {
    res.render('signup', {title: 'Express'});
});

router.get('/logout', function(req, res, next) {
    res.clearCookie("session");
    res.clearCookie("permanentSession");
    res.render('index', {title: 'Express', username: "", login_is_correct: true});
});

router.post('/signup', function (req, res) {
    user.insert(req,res);
    res.redirect('/map');
});

//JSON object to be added to cookie
// {"session": username}

//Route for adding cookie
// router.get('/setuser', (req, res)=>{
//     res.cookie("userData", userss, {maxAge: 10000});
//     res.send('user data added to cookie');
// });

//Iterate users data from cookie
router.get('/getuser', (req, res)=>{
//shows all the cookies
    console.log(JSON.stringify(req.cookies));
});

router.get('/private/images/:userId/:pictureId', function (req, res) {
    if(req.cookies.session || req.cookies.permanentSession) {
        let username = req.cookies.session ? req.cookies.session : req.cookies.permanentSession;
        User.findOne({username: username}, function (err, user) {
            let imgPath = "./private/images/" + req.params.userId + "/" + req.params.pictureId;
            if(fs.existsSync(imgPath)) {
                fs.readFile(imgPath, function read(err, data) {
                    if(err) {
                        throw err;
                    }
                    let img = base64_encode(data);
                    res.writeHead(200, {'Content-Type': 'image/gif' });
                    res.end(data, 'binary');
                })
            }
        })
    }
});

function base64_encode(bitmap) {
    // convert binary data to base64 encoded string
    return new Buffer(bitmap).toString('base64');
}


module.exports = router;

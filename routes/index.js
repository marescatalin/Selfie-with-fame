var express = require('express');
var router = express.Router();
var User = require('../models/user');
var fs = require('fs');

var login = false;

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
    res.render('map');
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

router.get('/chatroom', function (req,res){
    res.render('chatroom');
});
router.get('/private/images/:userId/:pictureId', function (req, res) {
    if (req.cookies.session || req.cookies.permanentSession) {
        let username = req.cookies.session ? req.cookies.session : req.cookies.permanentSession;
        User.findOne({username: username}, function (err, user) {
            let imgPath = "./private/images/" + req.params.userId + "/" + req.params.pictureId;
            if (fs.existsSync(imgPath)) {
                fs.readFile(imgPath, function read(err, data) {
                    if (err) {
                        throw err;
                    }
                    let img = base64_encode(data);
                    res.writeHead(200, {'Content-Type': 'image/gif'});
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

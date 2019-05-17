var User = require('../models/user');
var bcrypt = require('bcryptjs');
var salt = bcrypt.genSaltSync(10);

exports.updateUser = function(req,res){
    let username = req.cookies.session; //guyguyg
    console.log(username);
    let user = req.body;

    if (user.new == ""){
        User.updateOne({"username" : username}, {$set: {"username" : user.username, "bio": user.bio}}, function (err, result) {
            if(result) {
                console.log("New User" + result);
                res.clearCookie("session");
                res.clearCookie("permanentSession");
                res.cookie("session", user.username, {maxAge: 3600000});
                res.render('settings',{username: JSON.stringify(user.username), bio: JSON.stringify(user.bio),notMatch: false,passwordChanged: false});
            }
        });

        console.log("UPDATED");

    }else{
        User.findOne({username: username}, function (err, user) {
            console.log(user);
            if (!bcrypt.compareSync(req.body.currentPassword, user.password)) {
                res.render('settings',{username: JSON.stringify(req.body.username), bio: JSON.stringify(req.body.bio),notMatch: true,passwordChanged: false});
            } else {
                let password = bcrypt.hashSync(req.body.new ,salt);
                User.updateOne({"username" : username}, {$set: {"username" : req.body.username,"password": password, "bio": req.body.bio}}, function (err, result) {
                    if(result) {
                        console.log("New User" + result);
                        res.clearCookie("session");
                        res.clearCookie("permanentSession");
                        res.cookie("session", req.body.username, {maxAge: 3600000});
                        res.render('settings',{username: JSON.stringify(req.body.username), bio: JSON.stringify(req.body.bio),notMatch: false,passwordChanged: true});
                    }
                });
            }
        });
    }


};


exports.getUser = function (req,res) {
    let username = req.cookies.session;
   User.findOne({username: username}, function(err, result) {
        if (err) throw err;
         res.render('settings',{username: JSON.stringify(result.username), bio: JSON.stringify(result.bio),notMatch: false,passwordChanged: false});
    });
};


exports.query = function (req, res) {
    var userData = req.body;
    if (userData == null) {
        res.status(403).send('No data sent!')
    }
    try {
        // var user = new User({
        //     username: userData.username,
        //     password: userData.password,
        //     bio: userData.bio
        // });
        // console.log('received: ' + user);

        User.findOne({username: userData.username}, function (err, user) {
            if (user === null) {
                res.render('index', {title: 'Express', username: JSON.stringify(req.body.username), login_is_correct: false});
            } else if (user.username === req.body.username) {
                if (bcrypt.compareSync(userData.password, user.password))
                {
                    res.clearCookie("session");
                    res.cookie("session", userData.username, {maxAge: 3600000});
                    res.redirect('map');
                }else{
                    res.render('index', {title: 'Express', username: JSON.stringify(req.body.username), login_is_correct: false});
                }
            }
        });

    } catch (e) {
        res.status(500).send('error ' + e);
    }
};


exports.insert = function (req, res) {
    var userData = req.body;
    if (userData == null) {
        res.status(403).send('No data sent!')
    }
    try {
        let password = bcrypt.hashSync(userData.password, salt);
        console.log(password);
        var user = new User({
            username: userData.username,
            password: password,
            bio: userData.bio
        });
        console.log('received: ' + user);
        res.clearCookie("session");
        res.cookie("session", user.username, {maxAge: 3600000});

        user.save(function (err, results) {
            console.log(results._id);

            if (err)
                res.status(500).send('Invalid data!');

            // res.setHeader('Content-Type', 'application/json');
            // res.send(JSON.stringify(user));
        });
    } catch (e) {
        res.status(500).send('error ' + e);
    }
};

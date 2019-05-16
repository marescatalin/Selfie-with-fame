var User = require('../models/user');
var bcrypt = require('bcryptjs');
var salt = bcrypt.genSaltSync(10);

exports.getUser = function () {
   User.findOne({}, function(err, result) {
        if (err) throw err;
        console.log(result.username);
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

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
    var result = false;
    if (userData == null) {
        res.status(403).send('No data sent!')
    }
    try {
        var user = new User({
            username: userData.username,
            password: userData.password,
            bio: userData.bio
        });
        console.log('received: ' + user);
        User.findOne({ username: req.body.username}, function(err, user) {
            if(user ===null){
                result = false;
            }else if (user.username === req.body.username && user.password === req.body.password){
                result =  true;
            } else {
                result = false;
            }
        });
        return result;

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
        var user = new User({
            username: userData.username,
            password: password,
            bio: userData.bio
        });
        console.log('received: ' + user);

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

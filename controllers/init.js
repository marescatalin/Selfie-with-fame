var mongoose = require('mongoose');
var User = require('../models/users');
var bcrypt = require('bcryptjs');

exports.init= function() {

    // uncomment if you need to drop the database
    User.deleteMany({}, function(err, obj) {
        if (err) throw err;
        console.log("User Collection Deleted");
    });

    var user = new User({
        username: 'acb16cm',
        password: '123456',
        bio: 'ceva'
    });

    console.log('username: '+user.username);
    console.log('password: '+user.password);
    console.log('bio: '+user.bio);
    //
    //
    user.save(function (err, results) {
        console.log(results._id);
    });
};


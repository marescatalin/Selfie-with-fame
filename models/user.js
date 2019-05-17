var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// schema for users table
var User = new Schema(
    {
        username: {type: String, required: true, max: 100},
        password: {type: String, required: true, max: 100},
        bio: {type: String, required: true, max: 100}
    }
);

// Virtual for a character's age
// Character.virtual('age')
//     .get(function () {
//         const currentDate = new Date().getFullYear();
//         const result= currentDate - this.dob;
//         return result;
//     });


var userModel = mongoose.model('User', User );

module.exports = userModel;
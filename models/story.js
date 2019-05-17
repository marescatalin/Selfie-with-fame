"use strict";

var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var Story = new Schema(
    {
        title: {type:String},
        message: {type:String},
        createdAt: {type:Date},
        pictures: {type:Array},
        author: {type:String},
        myEvent: {type:Schema.ObjectId}
    }
);

var storyModel = mongoose.model('Story', Story);


module.exports = storyModel;
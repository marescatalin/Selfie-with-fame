'use strict';

var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var MyEvent = new Schema(
    {
        myEventName: {type:String},
        description: {type:String},
        location: {
            lat: {type:String},
            lng: {type:String},
            address: {type:String},
            postcode: {type:String}
        },
        startDate: {type:Date},
        endDate: {type:Date},
        pictures: {type:String},
        keywords: {type:Array},
        author: {type:Schema.ObjectId}
    }
);

var myEventModel = mongoose.model('MyEvent', MyEvent );


module.exports = myEventModel;
let MyEvent = require('../models/myevent');

// Post new story
exports.new = function (req, res) {
    let postData = req.body;
    let myEvent = new MyEvent();
    myEvent.name = postData.name;
    myEvent.description = postData.description;
    console.log(myEvent);
};
let Story = require('../models/story');
let User = require('../models/user');
let ControllerHelpers = require('../helpers/controller_helpers');
let mongoose = require('mongoose');

// get the stories for one event
exports.getMyEventStories = function (req, res) {
    let myEventId = req.params.myEventId;
    console.log(myEventId);
    let stories = Story.find({"myEvent": myEventId}, function (err, results) {
        if(results) {
            console.log(results)
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify(results));
        }
    });
}

// Post new story
exports.new = function (req, res) {
    let postData = req.body;
    if (postData == null) {
        res.status(403).send('No data sent!')
    }
    console.log(postData);
    try {
        let username = req.cookies.session;
        let permUsername = req.cookies.permanentSession;
        if (username || permUsername) {
            username = username ? username : permUsername;
            User.findOne({username: username}, function (err, user) {
                if (user) {
                    let picturePaths = ControllerHelpers.savePictures(postData.pictures, user._id);
                    let story = new Story({
                        title: postData.title,
                        createdAt: Date.now(),
                        message: postData.message,
                        myEvent: postData.myevent,
                        pictures: picturePaths,
                        author: username
                    });
                    console.log("Received " + story);

                    story.save(function (err, results) {
                        if (err) {
                            console.log(err);
                            res.status(500).send("Invalid data!")
                        } else {
                            console.log("Result is ", results);
                            res.setHeader('Content-Type', 'application/json');
                            res.send(JSON.stringify(story));
                        }
                    })
                }
            })
        }
    } catch (e) {
        res.status(500).send("error " + e);
    }
}
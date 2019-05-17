let MyEvent = require('../models/myevent');
let User = require('../models/user');
let fs = require('fs');
let ControllerHelpers = require('../helpers/controller_helpers');

// Get all myEvents
exports.all = function (res) {
  let myEvents = MyEvent.find({}, function (err, results) {
      if(results) {
          res.setHeader('Content-Type', 'application/json');
          res.send(JSON.stringify(results));
      }
  });
};

exports.getMyEvent = function (req, res) {
    let eventId = req.params.myEventId;
    MyEvent.findOne({"_id": eventId}, function (err, result) {
        if(result) {
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify(result));
        }
    })
}

// Post new story
exports.new = function (req, res) {
    let postData = req.body;
    if (postData == null) {
        res.status(403).send('No data sent!')
    }
    try {
        let username = req.cookies.session;
        let permUsername = req.cookies.permanentSession;
        if(username || permUsername) {
            username = username ? username : permUsername;
            User.findOne({username: username}, function (err, user) {
                if(user) {
                    console.log(user);
                    let picturePaths = ControllerHelpers.savePictures(postData.pictures, user._id);
                    let myEvent = new MyEvent({
                        myEventName: postData.name,
                        description: postData.description,
                        location: {
                            lat: postData.location.lat,
                            lng: postData.location.lng,
                            address: postData.address,
                            postcode: postData.postcode
                        },
                        startDate: postData.startDate,
                        endDate: postData.endDate,
                        address: postData.address,
                        postCode: postData.postCode,
                        pictures: picturePaths,
                        author: username
                    });
                    console.log("Received " + myEvent);

                    myEvent.save(function (err, results) {
                        if (err) {
                            console.log(err);
                            res.status(500).send("Invalid data!")
                        } else {
                            console.log("Result is ", results);
                            res.setHeader('Content-Type', 'application/json');
                            res.send(JSON.stringify(myEvent));
                        }
                    })
                }
            })
        }
    } catch (e) {
        res.status(500).send("error " + e);
    }
};
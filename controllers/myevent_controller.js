let MyEvent = require('../models/myevent');
let User = require('../models/user');

// Post new story
exports.new = function (req, res) {
    let postData = req.body;
    if (postData == null) {
        res.status(403).send('No data sent!')
    }
    console.log(postData);
    try {
        let username = req.cookies.session;
        let authorUser = "Anonymous";
        if(username) {
            authorUser = User.find({username: username})
        }

        var myEvent = new MyEvent ({
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
            author: authorUser
        });
        console.log("Received " + myEvent);

        myEvent.save(function (err, results) {
            console.log(results._id);
            if(err) {
                res.status(500).send("Invalid data!")
            }
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify(myEvent));
        })
    } catch (e) {
        res.status(500).send("error " + e);
    }
};
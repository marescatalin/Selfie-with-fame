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
        let permUsername = req.cookies.permanentSession;
        if(username || permUsername) {
            username = username ? username : permUsername;
            User.findOne({username: username}, function (err, user) {
                if(user) {
                    console.log(user);
                    var myEvent = new MyEvent({
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
                        author: user._id
                    });
                    console.log("Received " + myEvent);

                    myEvent.save(function (err, results) {
                        if (err) {
                            console.log(err)
                            res.status(500).send("Invalid data!")
                        } else {
                            console.log("Result is ", results)
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

let savePictures = function (pictures, userId) {
    let targetDirectory = './private/images/' + userId + '/';
    if (!fs.existsSync(targetDirectory)) {
        fs.mkdirSync(targetDirectory);
    }
    let currentTime = new Date().getTime();
    console.log('saving pictures to ' + targetDirectory + currentTime);

    pictures.forEach(function (picture, index) {
        // strip off the data: url prefix to get just the base64-encoded bytes
        let imageBlob = picture.replace(/^data:image\/\w+;base64,/,
            "");
        let buf = new Buffer(imageBlob, 'base64');
        fs.writeFile(targetDirectory + currentTime + index +  '.png', buf);

        var filePath = targetDirectory + currentTime + index;
        console.log('file saved!');
    });
};
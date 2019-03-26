var Story = require('../models/story');

// Post new story
exports.new = function (req, res) {
    postData = req.body;
    var story = new Story();
    story.message = postData.message;
    story.date = Date.now();
    story.title = postData.title;
    story.pictures = postData.pictures;
    story.event = '';
    story.comments = '';
    console.log(story);
    res.status(200).send('Success');
}
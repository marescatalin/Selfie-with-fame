let Story = require('../models/story');

// Post new story
exports.new = function (req, res) {
    let postData = req.body;
    let story = new Story();
    story.message = postData.message;
    story.date = Date.now();
    story.title = postData.title;
    story.pictures = postData.pictures;
    story.myEvent = '';
    story.author = '';
    console.log(story);
    res.status(200).send('Success');
}
var storyController = require('../controllers/story_controller');
var express = require('express');
var router = express.Router();


router.get('/new', function (req, res) {
    res.render('story/new');
});

router.post('/new', storyController.new);

module.exports = router;
var myEventController = require('../controllers/myevent_controller');
var express = require('express');
var router = express.Router();


router.get('/new', function (req, res) {
    res.render('myevent/new');
});

router.post('/new', function (req, res) {
    res.redirect('/');
});

module.exports = router;

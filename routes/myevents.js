var myEventController = require('../controllers/myevent_controller');
var express = require('express');
var router = express.Router();


router.get('/new', function (req, res) {
    res.render('myevent/new');
});

router.post('/new', (req, res) => myEventController.new(req,res));

module.exports = router;

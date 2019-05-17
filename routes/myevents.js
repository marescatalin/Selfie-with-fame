var myEventController = require('../controllers/myevent_controller');
var express = require('express');
var router = express.Router();

router.get('/all', (req, res) => myEventController.all(res));

router.get('/new', function (req, res) {
    res.render('myevent/new');
});

router.post('/new', (req, res) => myEventController.new(req,res));

router.get('/:myEventId', (req, res) => myEventController.getMyEvent(req, res));

module.exports = router;

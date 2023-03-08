var express = require('express');
var router = express.Router();

router.use(function timeLog(req, res, next) {
    console.log('TIme: ', Date.now());
    next();
});

router.get('/', function(req, res) {
    res.send('ofpzopezf');
});

router.get('/about', function(req, res) {
    res.send('ABOUT BANANA');
});

module.exports = router;
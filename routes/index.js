var express = require('express');
var router = express.Router();

// Authentication imports.
var Auth = require('../middleware/Auth');

/* GET home page. */
router.get('/', function (req, res) {
    res.render('index', {title: 'Express'});
});

module.exports = router;

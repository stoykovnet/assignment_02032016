// Server imports.
var express = require('express');
var router = express.Router();

// Database imports.
var mongoose = require('mongoose');
var User = mongoose.model('User');
var passport = require('passport');

// Authentication imports.
var Auth = require('../middleware/Auth');

router.get('/', Auth, function (req, res, next) {
    User.find(function (err, users) {
        if (err)return next(err);

        res.json(users);
    });
});

router.get('/:user', Auth, function (req, res, next) {
    res.json(req.user);
});

router.put('/:user', Auth, function (req, res, next) {
    var user = req.user;

    user.firstName = req.body.firstName;
    user.email = req.body.email;
    user.firstName = req.body.firstName;
    user.lastName = req.body.lastName;
    user.honorific = req.body.honorific;
    user.sex = req.body.sex;
    user.address = req.body.address;
    user.city = req.body.city;
    user.zipCode = req.body.zipCode;

    user.save(function (err, user) {
        if (err) return (err);

        res.json(user);
    });
});

/**
 * Pre-loading user object, because most likely there will be many routes, which
 * will require to find a particular user by id.
 */
router.param('user', function (req, res, next, id) {
    var query = User.findById(id);

    query.exec(function (err, user) {
        if (err) return next(err);
        if (!user) return next(new Error('Such user does not exist.'));

        req.user = user;
        return next();
    });
});


module.exports = router;
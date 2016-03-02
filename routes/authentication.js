// Server imports.
var express = require('express');
var router = express.Router();

// Controller imports
var authCtrl = require('../controllers/AuthenticationCtrl');

// Database imports.
var mongoose = require('mongoose');
var User = mongoose.model('User');
var passport = require('passport');

/* POST URI: /authentication/register - Make an account*/
router.post('/register', function (req, res) {
    authCtrl.validateRegisterInput(req, function (errors) {
        // If something is wrong with input there'll be errors.
        if (errors.length > 0) return res.status(400).json({errors: errors});

        authCtrl.registerUser(req, function (token) {
            return res.json(token);
        });
    });
});

/* POST URI /authentication/login - Log in to account */
router.post('/login', function (req, res, next) {
    authCtrl.validateLoginInput(req, function (errors, req) {
        // If something is wrong with input there'll be errors.
        if (errors.length > 0) return res.status(400).json({errors: errors});

        authCtrl.authenticate(req, res,
            function (error) { // Login not accepted.
                res.status(401).json(error);
            },
            function (token) { // Login accepted.
                console.log(token);
                return res.json(token);
            });
    });
});

module.exports = router;

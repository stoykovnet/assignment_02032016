// Server imports.
var express = require('express');
var router = express.Router();

// Controller imports
var authCtrl = require('../controllers/AuthenticationCtrl');

// Database imports.
var mongoose = require('mongoose');
var User = mongoose.model('User');
var passport = require('passport');

// Authentication imports.
var Auth = require('../middleware/Auth');

/* POST register - Make an account*/
router.post('/register', function (req, res) {
    authCtrl.validateRegisterInput(req, function (errors) {
        // If something is wrong with input there'll be errors.
        if (errors.length > 0) return res.status(400).json({errors: errors});

        authCtrl.registerUser(req, function (token) {
            return res.json(token);
        });
    });
});

/* POST login - Log in to account */
router.post('/login', function (req, res, next) {
    authCtrl.validateLoginInput(req, function (errors, req) {
        // If something is wrong with input there'll be errors.
        if (errors.length > 0) return res.status(400).json({errors: errors});

        authCtrl.authenticate(req, res, function (token) {
            return res.json(token);
        });
    });
});

module.exports = router;

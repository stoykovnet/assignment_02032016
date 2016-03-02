// Server imports.
var express = require('express');
var router = express.Router();

// Controller imports
var AuthCtrl = require('../controllers/AuthenticationCtrl');

/* POST register - Make an account*/
router.post('/register', function (req, res) {
    AuthCtrl.validateRegisterInput(req, function (errors) {
        // If something is wrong with input there'll be errors.
        if (errors.length > 0) return res.status(400).json({errors: errors});

        AuthCtrl.registerUser(req, function (user) {
            return res.json(user);
        });
    });
});

/* POST login - Log in to account */
router.post('/login', function (req, res) {
    return res.json('not implemented');
});

module.exports = router;

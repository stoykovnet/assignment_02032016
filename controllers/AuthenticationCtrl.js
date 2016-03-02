// Database imports.
var mongoose = require('mongoose');
var User = mongoose.model('User');

// Authentication imports.
var passport = require('passport');

var AuthenticationCtrl = new function () {

    /**
     * Check if there is data for email, password, firstName and lastName.
     * They are mandatory fields. On success it callbacks an empty array, otherwise
     * it will an array with errors if there is no data for some of the fields.
     * @param req
     * @param callback
     */
    this.validateRegisterInput = function (req, callback) {
        var errors = [];

        _validateEmail(req.body.email, function (email_err) {
            if (email_err) errors.push(email_err);
            if (!req.body.password) errors.push('Enter your password');
            if (!req.body.firstName) errors.push('Enter your first name');
            if (!req.body.lastName) errors.push('Enter your last name');

            return callback(errors);
        });
    };

    /**
     * Store user data into the database. It callbacks error if saving fails.
     * @param req
     * @param callback
     */
    this.registerUser = function (req, callback) {
        _populateUser(req, function (user) {

            user.save(function (err) {
                if (err) return callback(err);

                return callback({token: user.generateToken()});
            });
        });
    };

    this.validateLoginInput = function (req, callback) {
        var errors = [];

        _validateEmail(req.body.email, function (email_err) {
            if (email_err) errors.push(email_err);
            if (!req.body.password) errors.push('Enter your password');

            return callback(errors, req);
        });
    };

    this.authenticate = function (req, res, error, callback) {
        passport.authenticate('local', function (err, user, info) {
            if (err) return error(err);

            if (user) {
                return callback({token: user.generateToken()});
            } else {
                return error(info);
            }
        })(req, res);
    };

    /**
     * Check if the provided email is valid. If an email is invalid it callbacks error.
     * @param email
     * @param callback
     */
    function _validateEmail(email, callback) {
        // No email is supplied.
        if (!email) return callback('Enter your email');

        var regex = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;
        // It is not a valid email.
        if (!regex.test(email)) return callback('Supply a valid email');

        return callback(); // Email is ok!
    }

    /**
     * Create a User model object and populate it with the provided data.
     * @param req
     * @param callback
     */
    function _populateUser(req, callback) {
        var user = new User({
            email: req.body.email,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            honorific: req.body.honorific,
            sex: req.body.sex,
            address: req.body.address,
            city: req.body.city,
            zipCode: req.body.zipCode,
            role: req.body.role
        });

        user.setPassword(req.body.password);

        return callback(user);
    }
};

module.exports = AuthenticationCtrl;
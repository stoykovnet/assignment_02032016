// Authentication imports.
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

// Database imports.
var mongoose = require('mongoose');
var User = mongoose.model('User');

passport.use(new LocalStrategy(
    function (email, password, done) {

        User.findOne({email: email}, function (err, user) {
            if (err) {
                return console.error(err);
            }

            if (!user) {
                return done(null, false, {message: 'Incorrect username. '});
            }

            if (!user.validatePassword(password)) {
                return done(null, false, {message: 'Invalid password. '});
            }

            return done(null, user);
        });

    }
));
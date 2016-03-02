// Authentication imports.
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

// Database imports.
var mongoose = require('mongoose');
var User = mongoose.model('User');

passport.use(new LocalStrategy({usernameField: 'email', passwordField: 'password'},
    function (email, password, done) {
        User.findOne({email: email}, function (err, user) {
            if (err) {
                return done(console.error(err));
            }

            if (!user || !user.validatePassword(password)) {
                return done(null, false, {
                    errors: ['Cannot log in. Please check your credentials.']
                });
            }

            return done(null, user);
        });

    }
));
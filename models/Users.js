var mongoose = require('mongoose');
var crypto = require('crypto');

var UserSchema = new mongoose.Schema({
    email: {type: String, unique: true},
    hash: String,
    salt: String,
    firstName: String,
    lastName: String,
    honorific: String,
    sex: String,
    address: String,
    city: String,
    zipCode: String
});

/*
 * Hash and salt the password, in order to save it in the database.
 */
UserSchema.methods.setPassword = function (password) {
    this.salt = crypto.randomBytes(16).toString('hex');

    this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');
};

/*
 * Validate the password against the hash using the salt stored in the database.
 */
UserSchema.methods.validatePassword = function (password) {
    var hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');

    return this.hash === hash;
};

mongoose.model('User', UserSchema);
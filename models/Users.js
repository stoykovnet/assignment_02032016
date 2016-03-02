var mongoose = require('mongoose');
var crypto = require('crypto');
var jwt = require('jsonwebtoken');

var UserSchema = new mongoose.Schema({
    // Why unique doesn't work?
    email: {type: String, index: true, unique: true , required: true},
    hash: {type: String, required: true},
    salt: {type: String, required: true},
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    honorific: String,
    sex: String,
    address: String,
    city: String,
    zipCode: String,
    role: {type: String, default: 'user'}
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

/*
 * Generate json web token which will be valid for 30 days.
 */
UserSchema.methods.generateToken = function () {

    var today = new Date();
    var expire = new Date();
    expire.setDate(today.getDate() + 30);

    return jwt.sign({
            _id: this._id,
            email: this.email,
            expire: parseInt(expire.getTime() / 1000)
        },
        'SOME_SECRET' // Secret key to sign tokens.
    );
};

mongoose.model('User', UserSchema);
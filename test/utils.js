// Database connection imports.
var mongoose = require('mongoose');
var databaseUrl = require('../config/databaseUrl');

// Change mode.
process.env.NODE_ENV = 'test';

/**
 * The database must be in a clean state to ensure that no data will interfere
 * with the test and thus altering the results.
 */
beforeEach(function (done) {

    if (mongoose.connection.readyState === 0) {
        mongoose.connect(databaseUrl.test, function (err) {
            if (err) {
                return console.error(err);
            }

            return clearDatabase(done);
        });
    } else {
        return clearDatabase(done);
    }
});

function clearDatabase(done) {

    for (var i in mongoose.connection.collections) {
        mongoose.connection.collections[i].remove(function () {
        });
    }
    return done(); // We're done - the database is in a clean state.
}

afterEach(function (done) {
    mongoose.disconnect();
    return done();
});
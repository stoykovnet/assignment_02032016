// Database connection imports.
var mongoose = require('mongoose');
var databaseUrl = require('../config/getDatabaseUrl');

// Change mode.
process.env.NODE_ENV = 'test';

/**
 * The database must be in a clean state to ensure that no data will interfere
 * with the test and thus altering the results.
 */
beforeEach(function (done) {

    if (mongoose.connection.readyState === 0) {
        mongoose.connect(databaseUrl(), function (err) {
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
    mongoose.connection.db.dropDatabase();
    return done();
}

afterEach(function (done) {
    mongoose.disconnect();
    return done();
});
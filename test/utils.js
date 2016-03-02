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
    // Open connection, if it is not open.
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

/**
 * Drop the database.
 * @param done
 * @returns {*}
 */
function clearDatabase(done) {
    mongoose.connection.db.dropDatabase();
    return done();
}

/**
 * Close connection after each test.
 */
afterEach(function (done) {
    mongoose.disconnect();
    return done();
});
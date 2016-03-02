// Test imports.
require('../utils');
var expect = require('chai').expect;
var testData = require('../userTestData');

// Database imports.
var mongoose = require('mongoose');
require('../../models/Users');
var User = mongoose.model('User');

describe('UserModel', function () {
    describe('Insert', function () {
        it('should save data for the fields below',
            function (done) {
                user = new User(testData);
                user.save(function (err, saved) {
                    // There should be no errors!
                    expect(err).to.equal(null);

                    assertUserData(saved, done);
                });
            }
        );

        it('should not allow two users to have the same email address',
            function (done) {
                assertEmailDuplication(done);
            }
        );
    });

    describe('Password Security', function () {
        it('should salt and hash user passwords',
            function (done) {
                var user = new User(testData);
                var testPassword = 'password';

                user.setPassword(testPassword);
                user.save(function (err, saved) {
                    assertUserPassword(saved, testPassword, done);
                });
            }
        );

        it('should accept valid passwords',
            function (done) {
                var user = new User(testData);
                var testPassword = 'password';

                user.setPassword(testPassword);

                user.save(function (err, saved) {
                    var isValid = saved.validatePassword(testPassword);
                    expect(isValid).to.equal(true);

                    done();
                });
            }
        );

        it('should NOT accept invalid passwords',
            function (done) {
                var user = new User(testData);
                var testPassword = 'password';
                var invalidPassword = 'invalid';

                user.setPassword(testPassword);

                user.save(function (err, saved) {
                    var isValid = saved.validatePassword(invalidPassword);
                    expect(isValid).to.equal(false);

                    done();
                });
            }
        );
    });
});

function assertUserData(savedData, callback) {
    expect(savedData.email).to.equal(testData.email);
    expect(savedData.hash).to.equal(testData.hash);
    expect(savedData.salt).to.equal(testData.salt);
    expect(savedData.firstName).to.equal(testData.firstName);
    expect(savedData.lastName).to.equal(testData.lastName);
    expect(savedData.honorific).to.equal(testData.honorific);
    expect(savedData.sex).to.equal(testData.sex);
    expect(savedData.address).to.equal(testData.address);
    expect(savedData.city).to.equal(testData.city);
    expect(savedData.zipCode).to.equal(testData.zipCode);
    expect(savedData.role).to.equal(testData.role);
    return callback();
}

function assertEmailDuplication(callback) {
    var userA = new User(testData);
    var userB = new User(testData);

    userA.save(function (err, savedA) {
        userB.save(function (err, savedB) {
            expect(savedA.email).to.not.equal(savedB.email);

            return callback();
        });
    });
}

function assertUserPassword(savedData, password, callback) {
    expect(savedData.hash).to.not.equal(password);
    expect(savedData.salt).to.not.equal(password);

    expect(savedData.hash).to.not.equal(testData.hash);
    expect(savedData.salt).to.not.equal(testData.salt);
    return callback();
}
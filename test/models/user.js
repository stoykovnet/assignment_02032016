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

                    expect(saved.email).to.equal(testData.email);
                    expect(saved.hash).to.equal(testData.hash);
                    expect(saved.salt).to.equal(testData.salt);
                    expect(saved.firstName).to.equal(testData.firstName);
                    expect(saved.lastName).to.equal(testData.lastName);
                    expect(saved.honorific).to.equal(testData.honorific);
                    expect(saved.sex).to.equal(testData.sex);
                    expect(saved.address).to.equal(testData.address);
                    expect(saved.city).to.equal(testData.city);
                    expect(saved.zipCode).to.equal(testData.zipCode);

                    done();
                });
            }
        );

        it('should not allow two users to have the same email address',
            function (done) {
                var userA = new User(testData);
                var userB = new User(testData);

                userA.save(function (err) {
                    userB.save(function (err) {
                        //There should be an error!
                        expect(err).to.not.equal(null);

                        done();
                    });
                });
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
                    expect(saved.hash).to.not.equal(testPassword);
                    expect(saved.salt).to.not.equal(testPassword);

                    expect(saved.hash).to.not.equal(testData.hash);
                    expect(saved.salt).to.not.equal(testData.salt);

                    done();
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
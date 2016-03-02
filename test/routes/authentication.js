// Test imports.
require('../utils');
var expect = require('chai').expect;

// Test data.
var dataToSend = require('./credentialsToSend');
var userTestData = require('../userTestData');
userTestData['password'] = 'password';

// http
var request = require('request');

// Base URL, which is going to be used for the requests.
var url = 'http://localhost:3000/authentication/';

describe('Authentication', function () {

    describe("URI: '/authentication/register'", function () {
        it('should make an account for user',
            function (done) {
                sendPostRegister(dataToSend.registration.complete,
                    function (err, res, body) {
                        expect(res.statusCode).to.equal(200);

                        assertUserData(JSON.parse(body), done);
                    });
            }
        );

        it('should NOT accept empty email, password, and names - should show errors',
            function (done) {

                sendPostRegister(dataToSend.empty,
                    function (err, res, body) {
                        var expectedErrors = {
                            errors: [
                                'Enter your email',
                                'Enter your password',
                                'Enter your first name',
                                'Enter your last name'
                            ]
                        };

                        assertPostResponse(res, body, 400, expectedErrors, done);
                    });
            }
        );

        it('should NOT accept invalid email address - should show errors',
            function (done) {
                sendPostRegister(dataToSend.registration.invalid,
                    function (err, res, body) {
                        var expectedErrors = {
                            errors: [
                                'Supply a valid email'
                            ]
                        };

                        assertPostResponse(res, body, 400, expectedErrors, done);
                    });
            }
        );
    });

    describe("URI: '/authentication/login' - log in to account", function () {
        it('should authenticate only users with valid credentials - should show errors',
            function (done) {
                // A user must be inserted first, in order to test log in.
                sendPostRegister(dataToSend.registration.required, function () {

                    sendPostLogin(dataToSend.login.complete, function (err, res, body) {

                        assertPostResponse(res, body, 200, userTestData, done);
                    });
                });
            }
        );

        it('should not authenticate users with invalid credentials - should show errors',
            function (done) {
                sendPostLogin(dataToSend.login.complete, function (err, res, body) {
                    var expectedErrors = {
                        errors: [
                            'Cannot log in. Please check your credentials.'
                        ]
                    };

                    assertPostResponse(res, body, 403, expectedErrors, done);
                });
            }
        );

        it('should not accept empty email and password - should show errors',
            function (done) {
                sendPostLogin(dataToSend.empty, function (err, res, body) {

                    var expectedErrors = {
                        errors: [
                            'Enter your email',
                            'Enter your password'
                        ]
                    };

                    assertPostResponse(res, body, 400, expectedErrors, done);
                });
            }
        );
    });
});

function assertUserData(httpUser, callback) {
    expect(httpUser.email).to.equal(userTestData.email);
    expect(httpUser.firstName).to.equal(userTestData.firstName);
    expect(httpUser.lastName).to.equal(userTestData.lastName);
    expect(httpUser.honorific).to.equal(userTestData.honorific);
    expect(httpUser.sex).to.equal(userTestData.sex);
    expect(httpUser.city).to.equal(userTestData.city);
    expect(httpUser.zipCode).to.equal(userTestData.zipCode);
    expect(httpUser.role).to.equal(userTestData.role);

    return callback();
}

function assertPostResponse(res, body, expectedCode, expectedResponse, callback) {
    expect(res.statusCode).to.equal(expectedCode);

    expect(body).to.equal(JSON.stringify(expectedResponse));

    return callback();
}

function sendPostRegister(formData, callback) {
    request.post({
        url: url + 'register',
        form: formData
    }, function (err, res, body) {
        return callback(err, res, body);
    });
}

function sendPostLogin(formData, callback) {
    // Post login is in a callback, because we have to wait.
    request.post({
        url: url + 'login',
        form: formData
    }, function (err, res, body) {
        return callback(err, res, body);
    });
}
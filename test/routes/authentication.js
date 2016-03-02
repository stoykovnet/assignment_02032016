// Test imports.
require('../utils');
var expect = require('chai').expect;
var request = require('request');
var userTestData = require('../userTestData');
userTestData['password'] = 'password';

describe('Authentication', function () {
    var url = 'http://localhost:3000/authentication/';

    describe("URI: '/authentication/register'", function () {
        it('should make an account for user',
            function (done) {
                request.post({
                    url: url + 'register',
                    form: userTestData
                }, function (err, res, body) {

                    var httpUser = JSON.parse(body);

                    expect(res.statusCode).to.equal(200);

                    expect(httpUser.email).to.equal(userTestData.email);
                    expect(httpUser.firstName).to.equal(userTestData.firstName);
                    expect(httpUser.lastName).to.equal(userTestData.lastName);
                    expect(httpUser.honorific).to.equal(userTestData.honorific);
                    expect(httpUser.sex).to.equal(userTestData.sex);
                    expect(httpUser.city).to.equal(userTestData.city);
                    expect(httpUser.zipCode).to.equal(userTestData.zipCode);
                    expect(httpUser.role).to.equal(userTestData.role);
                    done();
                });
            }
        );

        it('should NOT accept empty email, password, and names - should show errors',
            function (done) {
                request.post({
                    url: url + 'register',
                    form: {}
                }, function (err, res, body) {

                    var expectedResponse = {
                        errors: [
                            'Enter your email',
                            'Enter your password',
                            'Enter your first name',
                            'Enter your last name'
                        ]
                    };

                    expect(res.statusCode).to.equal(400);

                    expect(body).to.equal(JSON.stringify(expectedResponse));
                    done();
                });
            }
        );

        it('should NOT accept invalid email address - should show errors',
            function (done) {
                request.post({
                    url: url + 'register',
                    form: {
                        email: 'invalid-email-address',
                        password: 'password',
                        firstName: 'test',
                        lastName: 'testen'
                    }
                }, function (err, res, body) {

                    var expectedResponse = {
                        errors: [
                            'Supply a valid email'
                        ]
                    };

                    expect(res.statusCode).to.equal(400);

                    expect(body).to.equal(JSON.stringify(expectedResponse));
                    done();
                });
            }
        );
    });

    describe("URI: '/authentication/login' - log in to account", function () {
        it('should authenticate only users with valid credentials - should show errors',
            function (done) {
                // A user must be inserted first, in order to do the test.
                request.post({
                    url: url + 'register',
                    form: {
                        email: 'test@testen.com',
                        password: 'password',
                        firstName: 'test',
                        lastName: 'testen'
                    }
                }, function (err, res, body) {
                    // Post login is in a callback, because we have to wait.
                    request.post({
                        url: url + 'login',
                        form: {
                            email: userTestData.email,
                            password: 'password'
                        }
                    }, function (err, res, body) {

                        expect(res.statusCode).to.equal(200);

                        expect(JSON.parse(body).email).to.equal('test@testen.com');
                        done();
                    });
                });
            }
        );

        it('should not authenticate users with invalid credentials - should show errors',
            function (done) {
                request.post({
                    url: url + 'login',
                    form: {
                        email: userTestData.email,
                        password: 'password'
                    }
                }, function (err, res, body) {

                    var expectedResponse = {
                        errors: [
                            'Cannot log in. Please check your credentials.'
                        ]
                    };

                    expect(res.statusCode).to.equal(403);

                    expect(body).to.equal(JSON.stringify(expectedResponse));
                    done();
                });
            }
        );

        it('should not accept empty email and password - should show errors',
            function (done) {
                request.post({
                    url: url + 'register',
                    form: {}
                }, function (err, res, body) {

                    var expectedResponse = {
                        errors: [
                            'Enter your email',
                            'Enter your password'
                        ]
                    };

                    expect(res.statusCode).to.equal(400);

                    expect(body).to.equal(JSON.stringify(expectedResponse));
                    done();
                });
            }
        );
    });
});
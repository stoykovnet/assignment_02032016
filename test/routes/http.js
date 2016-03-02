var request = require('request');

var http = new function () {

    this.assertPostResponse = function (res, body, expectedCode, expectedResponse, callback) {
        expect(res.statusCode).to.equal(expectedCode);

        expect(body).to.equal(JSON.stringify(expectedResponse));

        return callback();
    };

    this.sendPostRegister = function (formData, callback) {
        request.post({
            url: url + 'register',
            form: formData
        }, function (err, res, body) {
            return callback(err, res, body);
        });
    };

    this.sendPostLogin = function (formData, callback) {
        // Post login is in a callback, because we have to wait.
        request.post({
            url: url + 'login',
            form: formData
        }, function (err, res, body) {
            return callback(err, res, body);
        });
    };
};

module.exports = http;
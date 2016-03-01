// Test imports.
var expect = require('chai').expect;
var request = require('request');

describe("URI: '/' - index", function () {
    var url = 'http://localhost:3000';

    it('should return code 200',
        function (done) {
            request.get(url, function (err, res, body) {
                expect(res.statusCode).to.equal(200);
                done();
            });
        }
    );
});
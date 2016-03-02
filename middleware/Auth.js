var jwt = require('express-jwt');

var Auth = new jwt({
    secret: 'SECRET', userProperty: 'payload'
});

module.exports = Auth;
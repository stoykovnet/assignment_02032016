var jwt = require('express-jwt');

var Auth = jwt({
    secret: 'SECRET', userProperty: 'payload'
});

module.exports = Auth;
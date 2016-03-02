var userTestData = require('../userTestData');

var dataToSend = {
    registration: {
        complete: userTestData,
        required: {
            email: 'test@testen.com',
            password: 'password',
            firstName: 'test',
            lastName: 'testen'
        },
        invalid: {
            email: 'invalid-email-address',
            password: 'password',
            firstName: 'test',
            lastName: 'testen'
        }
    },
    login: {
        complete: {
            email: userTestData.email,
            password: 'password'
        }
    },
    empty: {}
};

module.exports = dataToSend;
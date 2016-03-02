/**
 * Sample user data that can be used in tests. For instance:
 * - to create new users destined to be stored in the database.
 * - send user data via HTTP
 * Note: password here is omitted, because it must be hashed and salted.
 */
var userTestData = {
    email: 'test@test.com',
    hash: 'hash-test',
    salt: 'salt-test',
    firstName: 'Test',
    lastName: 'Testen',
    honorific: 'Dr.',
    sex: 'Female',
    address: 'Testengade 1',
    city: 'Aalborg',
    zipCode: '9000',
    role: 'user'
};

module.exports = userTestData;
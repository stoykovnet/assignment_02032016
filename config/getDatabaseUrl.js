var getDatabaseUrl = function () {
    switch (process.env.NODE_ENV) {
        case 'production':
            return 'mongodb://localhost/ums-prod';
            break;

        case 'development':
            return 'mongodb://localhost/ums-dev';
            break;

        case 'test':
        default:
            return 'mongodb://localhost/ums-test';
            break;
    }
};

module.exports = getDatabaseUrl;
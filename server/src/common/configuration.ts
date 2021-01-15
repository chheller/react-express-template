import isNil from 'lodash/isNil';

const configuration = {
    cookieSecret: process.env.COOKIE_SECRET || 'a-cookie-secret',
    port: parseInt(process.env.PORT || '8080', 10),
    mongo: {
        hostname: process.env.MONGO_HOSTNAME || 'mongo',
        port: parseInt(process.env.MONGO_PORT || '27017', 10),
        username: process.env.MONGO_USERNAME || 'default_user_username',
        password: process.env.MONGO_PASSWORD || 'default_user_password',
        database: process.env.MONGO_DATABASE || 'default_database',
    },
};

Object.entries(configuration).forEach(([key, value]) => {
    if (isNil(value)) {
        throw new Error(`Configuration was missing for ${key}`);
    }
});

export default configuration;

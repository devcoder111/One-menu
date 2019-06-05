
require('dotenv').config({path: 'path-to-.env')
module.exports = {
    development: {
        client: 'pg',
        debug: true,
        connection: process.env.DATABASE_URL,
        acquireConnectionTimeout: 10000,
        migrations: {
            directory: './migrations',
            tableName: 'knex_migrations',
        },
    },
    production: {
        client: 'pg',
        debug: true,
        connection: process.env.DATABASE_URL,
        ssl: true,
        acquireConnectionTimeout: 10000,
        migrations: {
            directory: './migrations',
            tableName: 'knex_migrations',
        },
    },
}
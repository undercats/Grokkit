'use strict';

module.exports = {

  development: {
    client: 'pg',
    connection: 'postgres://localhost/grokkit'
  },

  production: {
    client: 'pg',
    connection: process.env.DATABASE_URL
  },
  migrations: {
      tableName: 'knex_migrations'
    }

};

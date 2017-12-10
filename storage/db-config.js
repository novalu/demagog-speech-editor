const knex = require('knex');

function createKnex() {
  return knex({
    client: 'pg',
    debug: false,
    connection: process.env.DATABASE_URL,
    pool: {
      min: 2,
      max: 10
    }
  });
}

exports.createKnex = createKnex;
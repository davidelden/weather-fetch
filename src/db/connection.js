const config = require('../../knexfile.js'),
      pg = require('knex')(config);

module.exports = pg;

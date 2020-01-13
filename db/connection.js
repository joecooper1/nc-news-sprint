const knex = require("knex");
const testConfig = require("../knexfile");

const connection = knex(testConfig);

module.exports = connection;

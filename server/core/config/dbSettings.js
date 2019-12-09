require('dotenv').config({ path: './process.env' })
var connection = {}

switch(process.env.DB_ENGINE){
    case 'mysql':
      connection = {
        host : process.env.DB_HOST,
        user : process.env.DB_USER,
        password : process.env.DB_PASSWORD,
        database : process.env.DB_NAME,
        port: process.env.DB_PORT
      }
    break;
    case 'pg':
      connection = {
        host : process.env.DB_HOST,
        user : process.env.DB_USER,
        password : process.env.DB_PASSWORD,
        database : process.env.DB_NAME,
        port: process.env.DB_PORT
      }
    break;
    case 'default':
      connection = {
        host : process.env.DB_HOST,
        user : process.env.DB_USER,
        password : process.env.DB_PASSWORD,
        database : process.env.DB_NAME,
        port: process.env.DB_PORT
      }
    break;
}

module.exports.dbConnection = require('knex')({
  client: process.env.DB_ENGINE,
  version: process.env.DB_ENGINE_VERSION,
  connection: connection
});

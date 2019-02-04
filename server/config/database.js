const path = require("path");
/**
 * The different database configurations for different environments.
 */
const config = {
  development: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
    logging: false,
    operatorAliases: false
  },
  test: {
    dialect: "sqlite",
    storage: "database.sqlite",
    logging: false,
    operatorAliases: false
  },
  production: {
    connection_uri: process.env.DATABASE_URL,
    logging: false,
    operatorAliases: false
  }
};

module.exports = config;

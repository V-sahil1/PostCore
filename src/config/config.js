import dotenv from "dotenv";

dotenv.config();

module.exports = {
  development: {
    username: process.env.SQL_NAME,
    password: process.env.SQL_PASSWORD,
    database: process.env.SQL_DATABASE,
    host: process.env.SQL_HOST,
    dialect: "mysql",
  },
};

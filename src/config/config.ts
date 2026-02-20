import { env } from "./env.config";

export default {
  development: {
    username: env.DB.USER,
    password: env.DB.PASSWORD,
    database: env.DB.NAME,
    host: env.DB.HOST,
    dialect: "mysql"
  }
};

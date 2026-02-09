import "dotenv/config";
import { MESSAGES } from "../const/message";

export type Env = "development" | "test" | "production";

const processEnv = process.env;

function getrequiredenv(name: string): string {
  const value = processEnv[name];
  if (!value) {
    throw new Error(`${MESSAGES.ENV_MISSING}: ${name}`);
  }
  return value;
}

export const env = {
  NODE_ENV: (processEnv.NODE_ENV as Env) || "development",

  DB: {
    NAME: getrequiredenv("SQL_DATABASE"),
    USER: getrequiredenv("SQL_NAME"),
    PASSWORD: getrequiredenv("SQL_PASSWORD"),
    HOST: getrequiredenv("SQL_HOST"),
    JWT_EXPIRE: getrequiredenv("JWT_EXPIRE"),
    JWT_SECRET: getrequiredenv("JWT_SECRET"),
    MONGO_URI: getrequiredenv("MONGO_URI"),
    SESSION_SECRET:getrequiredenv("SESSION_SECRET"),
    PORT:getrequiredenv("PORT"),

  },
};
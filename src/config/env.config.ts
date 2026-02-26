import "dotenv/config";
import { ERRORS } from "../const/message";
import { AppError } from "../utils/errorHandler";

export type Env = "development" | "test" | "production";

const processEnv = process.env;

function getEnvValue(name: string): string {
  const value = processEnv[name];
  if (!value) {
    throw new AppError(`${ERRORS.MESSAGES.NOT_FOUND("ENV")}: ${name}`, ERRORS.STATUS_CODE.NOT_FOUND);
  }
  return value;
}

export const env = {
  NODE_ENV: (processEnv.NODE_ENV as Env) || "development",

  DB: {
    NAME: getEnvValue("SQL_DATABASE"),
    USER: getEnvValue("SQL_NAME"),
    PASSWORD: getEnvValue("SQL_PASSWORD"),
    HOST: getEnvValue("SQL_HOST")
  },

  JWT: {
    JWT_EXPIRE: getEnvValue("JWT_EXPIRE"),
    JWT_SECRET: getEnvValue("JWT_SECRET"),

  },
  MONGO: {
    MONGO_URI: getEnvValue("MONGO_URI"),
  },
  SESSION: {

    SESSION_SECRET: getEnvValue("SESSION_SECRET"),

  },
  SERVER: {
    PORT: getEnvValue("PORT"),

  },

  LOG: {
    FILE_LOGGER: getEnvValue("FILE_LOGGER"),
  },
  REDIS: {
    REDIS_HOST: getEnvValue("REDIS_HOST"),
    REDIS_PASSWORD: getEnvValue("REDIS_PASSWORD"),
    REDIS_PORT: getEnvValue("REDIS_PORT"),
    REQUEST_TIME: getEnvValue('REQUEST_TIME'),
    RATE_LIMITER: getEnvValue("RATE_LIMITER")

  }

};

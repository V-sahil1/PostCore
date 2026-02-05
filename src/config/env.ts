import "dotenv/config";

export type Env = "development" | "test" | "production";

function required(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }
  return value;
}

export const ENV: Env = (process.env.NODE_ENV as Env) || "development";

export const env = {
  NODE_ENV: ENV,

  DB: {
    NAME: required("SQL_DATABASE"),
    USER: required("SQL_NAME"),
    PASSWORD: required("SQL_PASSWORD"),
    HOST: required("SQL_HOST"),
  },
}; 
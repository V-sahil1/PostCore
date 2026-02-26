import Redis from "ioredis";
import { env } from "./env.config";

export const redis = new Redis({

  password: env.REDIS.REDIS_PASSWORD,
  host: env.REDIS.REDIS_HOST,
  port: parseInt(env.REDIS.REDIS_PORT),
  maxRetriesPerRequest: null, // ← add this

});

redis.on("connect", () => {
  console.log("Redis Connected");

})
import { Request, Response, NextFunction } from "express";
import { redis } from "../config/redis";
import { env } from "../config/env.config";
import { number } from "joi";

export const redisRateLimiter = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const clientIp =
      (req.headers["x-forwarded-for"] as string)?.split(",")[0] ||
      req.socket.remoteAddress ||
      "unknown";
    console.log("heuuuuuuuu" + req);
    const key = `rate_limit:${clientIp}`;

    const requestCount = await redis.incr(key);
    console.log(requestCount);

    // If first request → set expiry (example: 60 sec window)
    if (requestCount === 1) {
      await redis.expire(key, env.REDIS.REQUEST_TIME);
    }

    const ttl = await redis.ttl(key);

    if (requestCount > Number(env.REDIS.RATE_LIMITER)) {
      return res.status(429).json({
        success: false,
        message: `Too many requests. Try again after ${ttl} seconds.`,
      });
    }

    next();
  } catch (error) {
    next(error);
  }
};
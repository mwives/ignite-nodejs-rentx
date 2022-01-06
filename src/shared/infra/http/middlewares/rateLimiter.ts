import { NextFunction, Request, Response } from "express";
import Redis from "ioredis";
import { RateLimiterRedis } from "rate-limiter-flexible";

import { AppError } from "@shared/errors/AppError";

async function rateLimiter(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const redisClient = new Redis({
      host: process.env.REDIS_HOST,
      port: Number(process.env.REDIS_PORT),
    });

    const limiter = new RateLimiterRedis({
      storeClient: redisClient,
      keyPrefix: "",
      points: 10, // 10 request
      duration: 5, // per 5 sec by IP
    });

    await limiter.consume(req.ip);

    return next();
  } catch (err) {
    throw new AppError("Too many requests", 429);
  }
}

export { rateLimiter };

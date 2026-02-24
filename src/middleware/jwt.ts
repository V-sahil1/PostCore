import jwt from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";
// import {  MESSAGES } from "../const/message";
import { env } from "../config/env.config";
import { AppError } from "../utils/errorHandler";
import { ERRORS, globalErrorHandler } from "../const/message";
import type { AuthUser } from "../Interface/type";

const message = ERRORS.MESSAGES;
const statusCode = ERRORS.STATUS_CODE;

export const authenticateJWT = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !/^Bearer\s+/i.test(authHeader)) {
    throw new AppError(message.UNAUTHORIZED, statusCode.UNAUTHORIZED)
  }

  const token = authHeader.split(" ")[1];

  if (!token || typeof token !== 'string') {
    throw new AppError(message.NOT_FOUND("Token"), statusCode.NOT_FOUND)
  }

  if (!env.JWT.JWT_SECRET) {
    throw new AppError(message.NOT_FOUND("Token"), statusCode.NOT_FOUND)
  }

  try {
    const decoded = jwt.verify(token, env.JWT.JWT_SECRET);
    if (typeof decoded === "string") {
      throw new AppError(message.INVALID("Token"), statusCode.UNAUTHORIZED)
    }
    req.user = decoded as AuthUser & jwt.JwtPayload;; // ✅ attach user
    next(); // ✅ go to controller
  } catch (error: unknown) {
    // console.log(error);

    globalErrorHandler(error, " Authentication");
  }
};

export const optionalJWT = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (authHeader && /^Bearer\s+/i.test(authHeader)) {
    try {
      const token = authHeader.split(" ")[1];

      if (!token || typeof token !== 'string') {
        return;
      }
      if (!env.JWT.JWT_SECRET) {
        req.user = undefined;
        return next();
      }
      const decoded = jwt.verify(token, env.JWT.JWT_SECRET);
      if (typeof decoded === "string") {
        req.user = undefined;
        return next();
      }
      req.user = decoded as AuthUser & jwt.JwtPayload;;
    } catch {
      req.user = undefined; // ✅ NOT null
    }
  }

  next();
};

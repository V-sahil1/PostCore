import jwt from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";
// import {  MESSAGES } from "../const/message";
import { env } from "../config/env.config";
import { AppError } from "../utils/errorHandler";
import { ERRORS, operationFailed } from "../const/error-message";

type AuthUser = {
  id: number;
  email?: string;
  role?: string;
} & jwt.JwtPayload;

const  message = ERRORS.message;
const statusCode = ERRORS.statusCode;

export const authenticateJWT = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !/^Bearer\s+/i.test(authHeader)) {
    throw new AppError(message.UNAUTHORIZED ,statusCode.UNAUTHORIZED)
  }

  const token = authHeader.split(" ")[1];

  if (!token || typeof token !== 'string') {
     throw new AppError(message.NOT_FOUND("Token"),statusCode.NOT_FOUND)
  }

  if (!env.JWT.JWT_SECRET) {
   throw new AppError(message.NOT_FOUND("Token"),statusCode.NOT_FOUND)
  }

  try {
    const decoded = jwt.verify(token, env.JWT.JWT_SECRET);
    if (typeof decoded === "string") {
    throw new AppError(message.INVALID("Token"),statusCode.UNAUTHORIZED)
    }
    req.user = decoded as AuthUser; // ✅ attach user
    next(); // ✅ go to controller
  } catch (error: unknown) {

    operationFailed(error," Authentication");
  }
};

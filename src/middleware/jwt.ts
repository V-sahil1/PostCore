import jwt from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";
import { errorMessage, MESSAGES } from "../const/message";
import { env } from "../config/env.config";
import { senderror } from "../utils/response.util";

type AuthUser = {
  id: number;
  email?: string;
  role?: string;
} & jwt.JwtPayload;

export const authenticateJWT = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !/^Bearer\s+/i.test(authHeader)) {
     return senderror(
      res,
      404,
      MESSAGES.TOKEN_MISSING
    )
  }

  const token = authHeader.split(" ")[1];

  if (!token || typeof token !== 'string') {
     return senderror(
      res,
      404,
      MESSAGES.TOKEN_MISSING
    )
  }

  if (!env.JWT.JWT_SECRET) {
    return senderror(
      res,
      500,
      MESSAGES.TOKEN_NOT_DEFINE
    )
  }

  try {
    const decoded = jwt.verify(token, env.JWT.JWT_SECRET);
    if (typeof decoded === "string") {
       return senderror(
      res,
      404,
      MESSAGES.TOKEN_MISSING
    )
    }
    req.user = decoded as AuthUser; // ✅ attach user
    next(); // ✅ go to controller
  } catch (error: unknown) {

     return senderror(
           res,
           500,
           errorMessage(error)
         )
  }
};

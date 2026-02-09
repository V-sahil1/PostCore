import jwt from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";
import { MESSAGES } from "../const/message";
import { env } from "../config/env.config";

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
    return res.status(401).json({ message: MESSAGES.TOKEN_MISSING });
  }

  const token = authHeader.split(" ")[1];

  if (!token || typeof token !== 'string') {
    return res.status(401).json({ message: MESSAGES.TOKEN_MISSING });
  }

  if (!process.env.JWT_SECRET) {
    return res.status(500).json({ message: MESSAGES.TOKEN_NOT_DEFINE });
  }

  try {
    const decoded = jwt.verify(token, env.DB.JWT_SECRET);
    if (typeof decoded === "string") {
      return res.status(401).json({ message: MESSAGES.TOKEN_MISSING });
    }
    req.user = decoded as AuthUser; // ✅ attach user
    next(); // ✅ go to controller
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : MESSAGES.UNAUTHORIZED
    return res.status(401).json({ message });
  }
};

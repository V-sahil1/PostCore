import jwt from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";

type AuthUser = {
  id: number;
  email?: string;
  role?: string;
} & jwt.JwtPayload;

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
      if (!process.env.JWT_SECRET) {
        req.user = undefined;
        return next();
      }
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      if (typeof decoded === "string") {
        req.user = undefined;
        return next();
      }
      req.user = decoded as AuthUser;
    } catch {
      req.user = undefined; // ✅ NOT null
    }
  }

  next();
};

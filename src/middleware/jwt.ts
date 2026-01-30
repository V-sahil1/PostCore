import jwt from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";

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
    return res.status(401).json({ message: "Token missing or invalid" });
  }

  const token = authHeader.split(" ")[1];
  
  if (!token || typeof token !== 'string') {
    return res.status(401).json({ message: "Token missing or invalid" });
  }

  if (!process.env.JWT_SECRET) {
    return res.status(500).json({ message: "JWT_SECRET is not defined" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (typeof decoded === "string") {
      return res.status(401).json({ message: "Token invalid" });
    }
    req.user = decoded as AuthUser; // ✅ attach user
    next();                    // ✅ go to controller
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unauthorized";
    return res.status(401).json({ message });
  }
};

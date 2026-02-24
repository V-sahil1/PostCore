import type { Request, Response, NextFunction } from "express";
import passport from "passport";
import type { User } from "../database/models/user-model";

interface AuthInfo {
  message: string;
}
// In a middleware file (e.g., auth.middleware.ts)
export const authenticateLocal = (req:Request, res:Response, next:NextFunction) => {
  passport.authenticate("local", (err:Error, user:User, info:AuthInfo) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(401).json({
        success: false,
        message: info.message || "Authentication failed"
      });
    }

    req.user = user;
    next();
  })(req, res, next);
};

// // Then in your route:
// router.post(
//   "/login",
//   validate(loginSchema),
//   authenticateLocal,
//   login
// );

import { Request, Response, NextFunction } from "express";
import { ErrorModel } from "../database/schema/errorlog";

export const errorHandler = async (
  err: Error & { statusCode?: number },
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  const statusCode = err.statusCode || 500;
  // console.log(req.body)
  try {
    await ErrorModel.create({
      method: req.method,
      url: req.originalUrl,
      status: statusCode,
      ip: req.ip ?? null,
      userAgent: req.headers["user-agent"] ?? null,
      message: err.message ?? "Unknown error",
      errorStack: err.stack ?? null,
      errorType: err.name,
      bodyMessage: JSON.stringify(req.body)

    });

  } catch (error) {
    console.error("Error saving error log:", error);
  }

  return res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
};

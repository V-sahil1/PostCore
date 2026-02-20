import type { Request, Response, NextFunction } from "express";
import { ErrorModel } from "../database/schema/errorlog";
import path from "path";
import fs from "fs/promises";
import { env } from "../config/env.config";

const FILE_LOGGER = env.LOG.FILE_LOGGER;

export const errorHandler = async (
  err: Error & { statusCode?: number },
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  const statusCode = err.statusCode ?? 500;

  const data = {
    time: new Date().toISOString(),
    method: req.method,
    url: req.originalUrl,
    status: statusCode,
    ip: req.ip ?? null,
    userAgent: req.headers["user-agent"] ?? null,
    message: err.message ?? "Unknown error",
    errorStack: err.stack ?? null,
    errorType: err.name,
    bodyMessage: JSON.stringify(req.body ?? {}),
  };

  if (FILE_LOGGER) {
    try {
      const now = new Date();
      const year = now.getFullYear().toString();
      const month = now.toLocaleString("en-US", { month: "long" });

      const dirPath = path.join(process.cwd(), "src", "logs", year, month);
      await fs.mkdir(dirPath, { recursive: true });

      const filePath = path.join(dirPath, "error.log");

      // ✅ Store every error (no condition)
      await fs.appendFile(
        filePath,
        `${JSON.stringify(data)}\n`,
        "utf8"
      );

    } catch (fileError) {
      console.error("Failed to save error log into FILESYSTEM:", fileError);
    }
  } else {
    try {
      // ✅ Store every error in DB
      await ErrorModel.create(data);
    } catch (dbError) {
      console.error("Error saving error log into DB:", dbError);
    }
  }

  return res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
};

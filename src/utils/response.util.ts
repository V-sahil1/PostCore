import type { Response } from "express";

export const sendSuccess = <T>(
  res: Response,
  statusCode: number,
  message: string,
  data?: T,
  token?: string
): Response => {
  return res.status(statusCode).json({
    message,
    token,
    data,
  });
};

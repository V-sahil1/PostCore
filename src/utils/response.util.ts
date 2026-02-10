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
export const senderror = <T>(
  res: Response,
  statusCode: number,
  message: string,
  data?: T,

): Response => {
  return res.status(statusCode).json({
    message,
    data,
  });
};

import morgan from "morgan";
import { Request, Response } from "express";
import  {ErrorModel }from "../database/schema/errorlog";

// Morgan custom logger middleware
const morganMiddleware = morgan(
  (tokens: morgan.TokenIndexer<Request, Response>, req: Request, res: Response) => {
    // console.log(res.locals);

    const log = {
  method: tokens.method?.(req, res) ?? "",
  url: tokens.url?.(req, res) ?? "",
  status: Number(tokens.status?.(req, res) ?? 0),
  responseTime: Number(tokens["response-time"]?.(req, res) ?? 0),
  ip: req.ip ?? null,
  userAgent: tokens["user-agent"]?.(req, res) ?? "",
  message:
        res.locals.error?.message ??
        res.locals.responseBody?.message ??
        null
      };

      console.log(res.locals.error);
    //change
    // Save log to MongoDB
    //  console.log(req.route);
    if (log.status >= 400) {
      ErrorModel.create(log).catch((err: Error) => {
        console.error("Log error:", err.message);
      });

      // code here
    }

    return null;
  }
);

export default morganMiddleware;
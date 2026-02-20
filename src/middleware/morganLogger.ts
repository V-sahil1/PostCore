import morgan from "morgan";
import type { Request, Response } from "express";
import path from "path";
import fs from "fs/promises";
import { env } from "../config/env.config";
import { mongoModel } from "../database/schema/mongoerr";

const FILE_LOGGER = env.LOG.FILE_LOGGER;
console.log("ehiubkdsbn");
console.log(FILE_LOGGER);

const morganMiddleware = morgan(
  (tokens: morgan.TokenIndexer<Request, Response>, req: Request, res: Response) => {

    const log = {
      time: new Date().toISOString(),
      method: tokens.method?.(req, res) ?? "",
      url: tokens.url?.(req, res) ?? "",
      status: Number(tokens.status?.(req, res) ?? 0),
      responseTime: Number(tokens["response-time"]?.(req, res) ?? 0),
      ip: req.ip ?? null,
      userAgent: tokens["user-agent"]?.(req, res) ?? "",
      message:
        res.locals.error?.message ??
        res.locals.responseBody?.message ??
        null,
    };

    return JSON.stringify(log);
  },
  {
    stream: {
      write: async (message: string) => {
        try {
          const log = JSON.parse(message);
          const now = new Date();

          const year = now.getFullYear().toString();
          const month = now.toLocaleString("en-US", { month: "long" });

          if (FILE_LOGGER) {

            const dirPath = path.join(process.cwd(), "src", "logs", year, month);

            await fs.mkdir(dirPath, { recursive: true });

            if (log.status < 400) {
              const fileName = "request.log";

              await fs.appendFile(
                path.join(dirPath, fileName),
                `${JSON.stringify(log)}\n`,
                "utf8"
              );
            }

          } else if (log.status < 400) {
            await mongoModel.create(log);
          }

        } catch (error) {
          console.error("Failed to save log:", error);
        }
      }
    }
  }
);

export default morganMiddleware;

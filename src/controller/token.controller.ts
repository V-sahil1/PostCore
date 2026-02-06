import type { Request, Response } from "express";
import * as tokenService from "../service/token.service";

/* ================= SAVE TOKEN ================= */
export const saveToken = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ message: "Token missing" });
    }

    const accessToken = authHeader.split(" ")[1];

    const result = await tokenService.saveTokenService(String(accessToken));
    return res.status(201).json(result);
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Internal Server Error";
    return res.status(500).json({ message });
  }
};

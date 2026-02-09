import type { Request, Response } from "express";
import * as tokenService from "../service/token.service";
import { MESSAGES } from "../const/message";

/* ================= SAVE TOKEN ================= */
export const saveToken = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ message: MESSAGES.TOKEN_MISSING });
    }

    const accessToken = authHeader.split(" ")[1];

    const result = await tokenService.saveTokenService(String(accessToken));
    return res.status(201).json(result);
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : MESSAGES.INTERNAL_SERVER_ERROR;
    return res.status(500).json({ message });
  }
};

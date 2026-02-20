import type { Request, Response } from "express";
import * as tokenService from "../service/token.service";
import { MESSAGES } from "../const/message";
import { sendSuccess } from "../utils/response.util";
import { ERRORS, globalErrorHandler } from "../const/error-message";
import { AppError } from "../utils/errorHandler";

// ---------------------------------------- SAVE TOKEN  ----------------------------------------------

export const saveToken = async (
  req: Request,
  res: Response
): Promise<Response|void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      throw new AppError(ERRORS.MESSAGES.UNAUTHORIZED, ERRORS.STATUS_CODE.UNAUTHORIZED)
      //  res.status(401).json({ message: MESSAGES.TOKEN_MISSING });
    }

    const accessToken = authHeader.split(" ")[1];

    const result = await tokenService.saveTokenService(String(accessToken));
    // console.log(result);
    return sendSuccess(
      res,
      MESSAGES.STATUS_CODE.SUCCESS,
      MESSAGES.SAVED,
      result
    )
    //  res.status(201).json(result);
  } catch (error: unknown) {

    globalErrorHandler(error, "Save Token")
  }
};

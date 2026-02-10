import type { Request, Response } from "express";
import * as tokenService from "../service/token.service";
import { errorMessage, MESSAGES } from "../const/message";
import { senderror, sendSuccess } from "../utils/response.util";

// ---------------------------------------- SAVE TOKEN  ----------------------------------------------

export const saveToken = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return sendSuccess(
        res,
        401,
        MESSAGES.TOKEN_MISSING
      )
      //  res.status(401).json({ message: MESSAGES.TOKEN_MISSING });
    }

    const accessToken = authHeader.split(" ")[1];

    const result = await tokenService.saveTokenService(String(accessToken));
    // console.log(result);
    return sendSuccess(
      res,
      201,
      MESSAGES.SAVED,
      result
    )
    //  res.status(201).json(result);
  } catch (error: unknown) {

    return senderror(
      res,
      500,
      errorMessage(error)
    )
  }
};

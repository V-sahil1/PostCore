import type { Request, Response } from "express";
import jwt from "jsonwebtoken";
import * as userService from "../service/user.service";
import { SUCCESSMESSAGES, operationCreate, globalErrorHandler, ERRORS } from "../const/message";
import { env } from "../config/env.config";
import { sendSuccess } from "../utils/response.util";
import { AppError } from "../utils/errorHandler";
// ----------------------------------------TYPES ----------------------------------------------

const message = ERRORS.MESSAGES;
const statusCode = ERRORS.STATUS_CODE;
// ---------------------------------------- JWT ----------------------------------------------
const JWT_SECRET = env.JWT.JWT_SECRET;
if (!JWT_SECRET) {
  throw new AppError(message.NOT_FOUND("JWT Token"), statusCode.NOT_FOUND);
}

// ----------------------------------------LOGIN  ----------------------------------------------

export const login = async (
  req: Request,
  res: Response
): Promise<Response | void> => {
  try {
    const { email, password } = req.body;

    const result = await userService.loginUserService(email, password);
    if (!email || !password) {
      // const m =new AppError(MESSAGES.REQUIRED,404)
      throw new AppError(message.ALL_FIELDS_REQUIRED, statusCode.ALL_FIELDS_REQUIRED);
    }

    const token = jwt.sign(
      {
        id: result.user.id,
        email: result.user.email,
        role: result.user.role,
      },
      JWT_SECRET,
      { expiresIn: "1d" }
    );
    const { id, ...userWithoutId } = result.user;

    //  console.log(result.user);
    return sendSuccess(
      res,
      SUCCESSMESSAGES.STATUS_CODE.SUCCESS,
      SUCCESSMESSAGES.LOGIN_SUCCESS,
      userWithoutId,
      token
    );
  } catch (error) {
    // console.log(error)

    globalErrorHandler(error, "login User!");
  }
};

// ----------------------------------------REGISTER  ----------------------------------------------
export const register = async (
  req: Request,
  res: Response
): Promise<Response | void> => {
  try {
    const { user_name, email, password, age } = req.body;

    if (!user_name || !email || !password) {
      // const m =new AppError(MESSAGES.REQUIRED,404)
      throw new AppError(message.ALL_FIELDS_REQUIRED, statusCode.ALL_FIELDS_REQUIRED);
    }

    const result = await userService.registerUserService(
      user_name,
      email,
      password,
      age
    );

    const token = jwt.sign(
      {
        id: result.user.id,
        email: result.user.email,
        role: result.user.role,
      },
      JWT_SECRET,
      { expiresIn: "1d" }
    );
    const { id, ...userWithoutId } = result.user;
    // console.log(res);

    return sendSuccess(
      res,
      SUCCESSMESSAGES.STATUS_CODE.SUCCESS,
      operationCreate("User"),
      userWithoutId,
      token
    );
  } catch (error) {
    // console.log(error)
    globalErrorHandler(error, "Register User")
  }
}

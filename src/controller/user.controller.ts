import type { Request, Response } from "express";
import jwt from "jsonwebtoken";
import * as userService from "../service/user.service";
import { errorMessage, MESSAGES, operationCreate, operationDelete, oprationUpdate } from "../const/message";
import { env } from "../config/env.config";
import { UserRole } from "../const/user-role";
import { senderror, sendSuccess } from "../utils/response.util";

// ---------------------------------------- JWT ----------------------------------------------
const JWT_SECRET = env.JWT.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error(MESSAGES.TOKEN_NOT_DEFINE);
}

// ----------------------------------------TYPES ----------------------------------------------
type AuthUser = {
  id: number;
  role?: UserRole;
  email?: string;
};

// ----------------------------------------REGISTER  ----------------------------------------------

export const register = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { user_name, email, password, role, age } = req.body;

    const result = await userService.registerUserService(
      user_name,
      email,
      password,
      role,
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

    // console.log(result.message);
    // console.log( MESSAGES.REGISTER_SUCCESS);

    return sendSuccess(
      res,
      200,
      operationCreate("User"),
      result.user,
      token
    );
  } catch (error: unknown) {
    // const message =
    //   error instanceof Error ? error.message : MESSAGES.BAD_REQUEST;
    return senderror(
      res,
      404,
      errorMessage(error)
    )
  }
};

// ----------------------------------------LOGIN  ----------------------------------------------

export const login = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { email, password } = req.body;

    const result = await userService.loginUserService(email, password);

    const token = jwt.sign(
      {
        id: result.user.id,
        email: result.user.email,
        role: result.user.role,
      },
      JWT_SECRET,
      { expiresIn: "1d" }
    );
    //  console.log(result.user);
    return sendSuccess(
      res,
      200,
      MESSAGES.LOGIN_SUCCESS,
      result.user,
      token
    );
    //  res.status(200).json({
    //       message: result.message,
    //       token,
    //       user: result.user,
    //     });
  } catch (error: unknown) {
    // const message =
    //   error instanceof Error ? error.message : MESSAGES.UNAUTHORIZED;
   return senderror(
      res,
      401,
      errorMessage(error)
    )
  }
};

// ---------------------------------------- DELETE USER  ----------------------------------------------

export const deleteUser = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const authUser = req.user as AuthUser;
    const userId = Number(req.params.userId);

    const result = await userService.deleteUserService(userId, authUser);
    // console.log(res);

    return sendSuccess(
      res,
      200,
      operationDelete("User"),
      result

    );
    // res.status(200).json(result);
  } catch (error: unknown) {

     return senderror(
      res,
      500,
      errorMessage(error)
    )
  }
};

// ---------------------------------------- GET ALL USERS  ----------------------------------------------

export const getUser = async (
  _req: Request,
  res: Response
): Promise<Response> => {
  try {
    const result = await userService.getAllUserService();
    return   sendSuccess(
      res,
      200,
      result

    );
    // res.status(200).json(result);
  } catch (error: unknown) {
    // const message =
    //   error instanceof Error
    //     ? error.message
    //     : MESSAGES.INTERNAL_SERVER_ERROR;
   return senderror(
      res,
      500,
      errorMessage(error)
    )
  }
};

// ---------------------------------------- UPDATE POST  ----------------------------------------------

export const updateUser = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const authUser = req.user as AuthUser;
    if (!authUser) {
     return senderror(
      res,
      500,
      MESSAGES.UNAUTHORIZED
    )
    }

    const id = Number(req.params.userId);
    const { user_name, email, password, role, age } = req.body;

    const data = await userService.updateUserService(id,authUser, user_name, email, password, role, age);
    return sendSuccess(
      res,
      200,
     oprationUpdate("User"),
      data

    );
    // res.status(200).json(data);
  } catch (error: unknown) { return senderror(
      res,
      500,
      errorMessage(error)
    ) }
};

import type { Request, Response } from "express";
import jwt from "jsonwebtoken";
import * as userService from "../service/user.service";
import {  MESSAGES, operationCreate, operationDelete, oprationUpdate } from "../const/message";
import { env } from "../config/env.config";
import { UserRole } from "../const/user-role";
import {  sendSuccess } from "../utils/response.util";
import {  ERRORS, operationFailed } from "../const/error-message";
import { AppError } from "../utils/errorHandler";

// ----------------------------------------TYPES ----------------------------------------------
type AuthUser = {
  id: number;
  role?: UserRole;
  email?: string;
};

const message =ERRORS.message;
const statusCode = ERRORS.statusCode;
// ---------------------------------------- JWT ----------------------------------------------
const JWT_SECRET = env.JWT.JWT_SECRET;
if (!JWT_SECRET) {
  throw new AppError(message.NOT_FOUND("JWT Token"),statusCode.NOT_FOUND);
}

// ----------------------------------------REGISTER  ----------------------------------------------

export const register = async (
  req: Request,
  res: Response
): Promise<Response | void> => {
  try {
    const { user_name, email, password,  age } = req.body;

    if (!user_name || !email || !password) {
      // const m =new AppError(MESSAGES.REQUIRED,404)
      throw new AppError(message.ALL_FIELDS_REQUIRED,statusCode.ALL_FIELDS_REQUIRED);
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
// console.log(res);

    return sendSuccess(
      res,
      200,
      operationCreate("User"),
      result.user,
      token
    );
  } catch (error) {
    // console.log(error)
    operationFailed(error,"Register User")
  }
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
      throw new AppError(message.ALL_FIELDS_REQUIRED,statusCode.ALL_FIELDS_REQUIRED);
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
    //  console.log(result.user);
    return sendSuccess(
      res,
      200,
      MESSAGES.LOGIN_SUCCESS,
      result.user,
      token
    );
  } catch (error) {
    // console.log(error)

   operationFailed(error, "login User!");
  }
};

// ---------------------------------------- DELETE USER  ----------------------------------------------

export const deleteUser = async (
  req: Request,
  res: Response
): Promise<Response | void>=> {
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
  } catch (error) {
    operationFailed(error,"Delete User")
  }
};

// ---------------------------------------- GET ALL USERS  ----------------------------------------------

export const getUser = async (
  req: Request,
  res: Response
): Promise<Response | void> => {
  try {
     const authUser = req.user as AuthUser;
     const userId = Number(req.params.userId);

    const result = await userService.getAllUserService(userId,authUser);
    return   sendSuccess(
      res,
      200,
      MESSAGES.SUCCESS,
      result,

    );

  } catch (error: unknown) {

  operationFailed(error, "Get User!");
  }
};

// ---------------------------------------- UPDATE POST  ----------------------------------------------

export const updateUser = async (
  req: Request,
  res: Response
): Promise<Response | void> => {
  try {
    const authUser = req.user as AuthUser;
    if (!authUser) {
     throw new AppError(message.UNAUTHORIZED,statusCode.UNAUTHORIZED);
    }

    const id = Number(req.params.userId);
    const { user_name, email, password, age } = req.body;

    const data = await userService.updateUserService(id,authUser, user_name, email, password, age);
    return sendSuccess(
      res,
      200,
     oprationUpdate("User"),
      data

    );
    // res.status(200).json(data);
  } catch (error: unknown) { operationFailed(error, "Update User!"); }
};

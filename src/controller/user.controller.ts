import type { Request, Response } from "express";
import jwt from "jsonwebtoken";
import * as userService from "../service/user.service";
import { MESSAGES } from "../const/message";
import { env } from "../config/env.config";

function errorMessage(error: unknown): string { return error instanceof Error ? error.message : MESSAGES.INTERNAL_SERVER_ERROR; }

// ---------------------------------------- JWT ----------------------------------------------
const JWT_SECRET = env.DB.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error(MESSAGES.TOKEN_NOT_DEFINE);
}

// ----------------------------------------TYPES ----------------------------------------------
type AuthUser = {
  id: number;
  role?: string;
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

    return res.status(201).json({
      message: result.message,
      token,
      user: result.user,
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : MESSAGES.BAD_REQUEST;
    return res.status(400).json({ message });
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

    return res.status(200).json({
      message: result.message,
      token,
      user: result.user,
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : MESSAGES.UNAUTHORIZED;
    return res.status(401).json({ message });
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

    return res.status(200).json(result);
  } catch (error: unknown) {
    const message =
      error instanceof Error
        ? error.message
        : MESSAGES.INTERNAL_SERVER_ERROR;
    return res.status(500).json({ message });
  }
};

// ---------------------------------------- GET ALL USERS  ----------------------------------------------

export const getUser = async (
  _req: Request,
  res: Response
): Promise<Response> => {
  try {
    const result = await userService.getAllUserService();
    return res.status(200).json(result);
  } catch (error: unknown) {
    const message =
      error instanceof Error
        ? error.message
        : MESSAGES.INTERNAL_SERVER_ERROR;
    return res.status(500).json({ message });
  }
};

// ---------------------------------------- UPDATE POST  ----------------------------------------------

export const updateUser = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const user = req.user as AuthUser;
    if (!user) {
      return res.status(401).json({ message: MESSAGES.UNAUTHORIZED });
    }

    const id = Number(req.params.userId);
    const { user_name,email,password,role,age } = req.body;

    const data = await userService.updateUserService(id, user_name,email,password,role,age);
    return res.status(200).json(data);
  } catch (error: unknown) { return res.status(500).json({ message: errorMessage(error) }); }
};

import type { Request, Response } from "express";
import * as userService from "../service/user.service"

/* ================= GET AUTH USER ================= */
type AuthUser = {
  id: number;
  role?: string;
  email?: string;
};

/* ================= REGISTER ================= */
export const register = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const result = await userService.registerUserService(req.body);
    return res.status(201).json(result);
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Bad Request";
    return res.status(400).json({ message });
  }
};

/* ================= LOGIN ================= */
export const login = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { email, password } = req.body;
    const result = await userService.loginUserService(email, password);
    return res.status(200).json(result);
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Unauthorized";
    return res.status(401).json({ message });
  }
};

/* ================= DELETE USER ================= */
export const deleteUser = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const authUser = req.user as AuthUser;
    const userId = Number(req.params.userId);

    const result = await userService.deleteUserService(
      userId,
      authUser
    );

    return res.status(200).json(result);
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Internal Server Error";
    return res.status(500).json({ message });
  }
};

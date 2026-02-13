import type { Request, Response } from "express";
import * as postService from "../service/post.service";
import {  MESSAGES, operationCreate, operationDelete, oprationUpdate } from "../const/message";
import {  sendSuccess } from "../utils/response.util";
import { ERRORS, operationFailed } from "../const/error-message";
import { AppError } from "../utils/errorHandler";

type AuthUser = { id: number; role?: string };
const message  = ERRORS.message
const statusCode  = ERRORS.statusCode
/* ================= CREATE POST ================= */
export const creatpost = async (
  req: Request,
  res: Response
): Promise<Response |void> => {
  try {
    const user = req.user as AuthUser;
    if (!user) {
   throw new AppError(message.UNAUTHORIZED, statusCode.UNAUTHORIZED);
    }

    const { title } = req.body;
    const result = await postService.createPostService(title, user);
    return sendSuccess(
      res,
      201,
      operationCreate("Post"),
      result
    )
  } catch (error) {operationFailed(error, "Create Post!");  }
};

/* ================= UPDATE POST ================= */
export const updatePost = async (
  req: Request,
  res: Response
): Promise<Response|void> => {
  try {
    const user = req.user as AuthUser;
    if (!user) {
         throw new AppError(message.NOT_FOUND("User"),statusCode.NOT_FOUND);
    }

    const id = Number(req.params.postId);
    const { title } = req.body;

    const data = await postService.updatePostService(id, title, user);
    return sendSuccess(
      res,
      200,
      oprationUpdate("Post"),
      data

    )
    //  .status(200).json(data);
  } catch (error) {
    operationFailed(error, "Update Post!");
    //  res.status(500).json({ message: errorMessage(error) });
  }
};

/* ================= GET ALL POSTS ================= */
export const getpost = async (
  _req: Request,
  res: Response
): Promise<Response> => {
  const data = await postService.getAllPostsService();
  return sendSuccess(
    res,
    200,
    MESSAGES.SUCCESS,
    data

  )
};

/* ================= GET POST BY ID ================= */
export const getpostById = async (
  req: Request,
  res: Response
): Promise<Response | void> => {
  try {
    const id = Number(req.params.postId);
    const data = await postService.getPostByIdService(id);
    return sendSuccess(
      res,
      200,
      MESSAGES.SUCCESS,
      data

    )
  } catch (error: unknown) {
        operationFailed(error, "Get Post!");
  }
};

/* ================= DELETE POST ================= */
export const postDelete = async (
  req: Request,
  res: Response
): Promise<Response | void> => {
  try {
    const user = req.user as AuthUser;
    if (!user) {
     throw new AppError(message.NOT_FOUND("User"),statusCode.NOT_FOUND);
    }

    const id = Number(req.params.postId);
    const result = await postService.deletePostService(id, user);
    return sendSuccess(
      res,
      200,
      operationDelete("Post"),
      result

    )
  } catch (error: unknown) {
   operationFailed(error,"Delete Post")
  }
};

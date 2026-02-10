import type { Request, Response } from "express";
import * as postService from "../service/post.service";
import { errorMessage, MESSAGES, operationCreate, operationDelete, oprationUpdate } from "../const/message";
import { senderror, sendSuccess } from "../utils/response.util";

type AuthUser = { id: number; role?: string };

/* ================= CREATE POST ================= */
export const creatpost = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const user = req.user as AuthUser;
    if (!user) {
      return senderror(
        res,
        404,
        MESSAGES.UNAUTHORIZED
      )
    }

    const { title } = req.body;
    const result = await postService.createPostService(title, user);
    return sendSuccess(
      res,
      201,
      operationCreate("Post"),
      result
    )
  } catch (error: unknown) { return res.status(500).json({ message: errorMessage(error) }); }
};

/* ================= UPDATE POST ================= */
export const updatePost = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const user = req.user as AuthUser;
    if (!user) {
      return res.status(401).json({ message: MESSAGES.UNAUTHORIZED });
    }

    const id = Number(req.params.upId);
    const { title } = req.body;

    const data = await postService.updatePostService(id, title, user);
    return sendSuccess(
      res,
      200,
      oprationUpdate("Post"),
      data

    )
    //  .status(200).json(data);
  } catch (error: unknown) {
    return senderror(
      res,
      500,
      errorMessage(error)
    )
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
): Promise<Response> => {
  try {
    const id = Number(req.params.pid);
    const data = await postService.getPostByIdService(id);
    return sendSuccess(
      res,
      200,
      MESSAGES.SUCCESS,
      data

    )
  } catch (error: unknown) {
    return senderror(
      res,
      500,
      errorMessage(error)
    )
  }
};

/* ================= DELETE POST ================= */
export const postDelete = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const user = req.user as AuthUser;
    if (!user) {
      return senderror(
        res,
        401,
        MESSAGES.UNAUTHORIZED
      )
    }

    const id = Number(req.params.delId);
    const result = await postService.deletePostService(id, user);
    return sendSuccess(
      res,
      200,
      operationDelete("Post"),
      result

    )
  } catch (error: unknown) {
    return senderror(
      res,
      500,
      errorMessage(error)
    )
  }
};

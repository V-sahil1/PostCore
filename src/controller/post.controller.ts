import type { Request, Response } from "express";
import * as postService from "../service/post.service";
import { MESSAGES, operationCreate, operationDelete, oprationUpdate } from "../const/message";
import { sendSuccess } from "../utils/response.util";
import { ERRORS, globalErrorHandler } from "../const/error-message";
import { AppError } from "../utils/errorHandler";

type AuthUser = { id: number; role?: string };
const message = ERRORS.MESSAGES
const statusCode = ERRORS.STATUS_CODE
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
      MESSAGES.STATUS_CODE.SUCCESS,
      operationCreate("Post"),
      result
    )
  } catch (error) {
    globalErrorHandler(error, "Create Post!");
  }
};

/* ================= UPDATE POST ================= */
export const updatePost = async (
  req: Request,
  res: Response
): Promise<Response|void> => {
  try {
    const user = req.user as AuthUser;
    if (!user) {
      throw new AppError(message.NOT_FOUND("User"), statusCode.NOT_FOUND);
    }

    const id = Number(req.params.postId);
    const { title } = req.body;

    const data = await postService.updatePostService(id, title, user);
    return sendSuccess(
      res,
      MESSAGES.STATUS_CODE.SUCCESS,
      oprationUpdate("Post"),
      data

    )
    //  .status(200).json(data);
  } catch (error) {
    globalErrorHandler(error, "Update Post!");
    //  res.status(500).json({ message: errorMessage(error) });
  }
};

/* ================= GET ALL POSTS ================= */
// export const getpost = async (
//   _req: Request,
//   res: Response
// ): Promise<Response> => {

//   const data = await postService.getAllPostsService();
//   return sendSuccess(
//     res,
//     200,
//     MESSAGES.SUCCESS,
//     data

//   )
// };

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
      MESSAGES.STATUS_CODE.SUCCESS,
      MESSAGES.SUCCESS,
      data

    )
  } catch (error: unknown) {
    globalErrorHandler(error, "Get Post!");
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
      throw new AppError(message.NOT_FOUND("User"), statusCode.NOT_FOUND);
    }

    const id = Number(req.params.postId);
    const result = await postService.deletePostService(id, user);
    return sendSuccess(
      res,
      MESSAGES.STATUS_CODE.SUCCESS,
      operationDelete("Post"),
      result

    )
  } catch (error: unknown) {
    globalErrorHandler(error, "Delete Post")
  }
};

// -------------------------------------------- GET PaginatedPost- ------------------------------------
export const postpaggination = async (
  req: Request,
  res: Response
): Promise<Response | void> => {
  try {

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 5;

    const paginatedResult = await postService.getPaginatedPost(page, limit);

    return sendSuccess(
      res,
      MESSAGES.STATUS_CODE.SUCCESS,
      MESSAGES.SUCCESS,
      paginatedResult
    )

  } catch (error) {
    return globalErrorHandler(error, "Get Paginated post");
  }
};

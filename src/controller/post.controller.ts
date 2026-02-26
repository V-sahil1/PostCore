import type { Request, Response } from "express";
import * as postService from "../service/post.service";
import { SUCCESSMESSAGES, operationCreate, operationDelete, oprationUpdate, ERRORS, globalErrorHandler } from "../const/message";
import { sendSuccess } from "../utils/response.util";
import { AppError } from "../utils/errorHandler";
import type { AuthUser } from "../Interface/type";
import { redis } from "../config/redis";
import { env } from "../config/env.config";

const message = ERRORS.MESSAGES
const statusCode = ERRORS.STATUS_CODE
/* ================= CREATE POST ================= */
export const creatPost = async (
  req: Request,
  res: Response
): Promise<Response | void> => {
  try {
    const user = req.user as AuthUser;
    if (!user) {
      throw new AppError(message.UNAUTHORIZED, statusCode.UNAUTHORIZED);
    }

    const { title } = req.body;
    const result = await postService.createPostService(title, user);

    return sendSuccess(
      res,
      SUCCESSMESSAGES.STATUS_CODE.SUCCESS,
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
): Promise<Response | void> => {
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
      SUCCESSMESSAGES.STATUS_CODE.SUCCESS,
      oprationUpdate("Post"),
      data

    )
    //  .status(200).json(data);
  } catch (error) {
    globalErrorHandler(error, "Update Post!");
    //  res.status(500).json({ message: errorMessage(error) });
  }
};

/* ================= GET POST BY ID ================= */
export const getPostById = async (
  req: Request,
  res: Response
): Promise<Response | void> => {
  try {
    const id = Number(req.params.postId);
    const cacheKey = `Post:${id}`
    const cachedUser = await redis.get(cacheKey);

    if (cachedUser) {
      return sendSuccess(
        res,
        200,
        "Post Data Fetched Successfully! (From Cache)",
        JSON.parse(cachedUser)
      );
    }

    const data = await postService.getPostByIdService(id);
    await redis.set(cacheKey, JSON.stringify(data), "EX", env.REDIS.REQUEST_TIME);
    return sendSuccess(
      res,
      SUCCESSMESSAGES.STATUS_CODE.SUCCESS,
      SUCCESSMESSAGES.SUCCESS,
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
      SUCCESSMESSAGES.STATUS_CODE.SUCCESS,
      operationDelete("Post"),
      result

    )
  } catch (error: unknown) {
    globalErrorHandler(error, "Delete Post")
  }
};

// -------------------------------------------- GET PaginatedPost- ------------------------------------
export const pagginationPost = async (
  req: Request,
  res: Response
): Promise<Response | void> => {
  try {

    const limit = Number(req.query.limit) || 5;
    const commentFlag = req.query.comment === "true";
    const lastCreatedAt = req.query.lastCreatedAt
      ? new Date(req.query.lastCreatedAt as string)
      : undefined;

    const paginatedResult = await postService.getPaginatedPostService(limit, lastCreatedAt, commentFlag);

    return sendSuccess(
      res,
      SUCCESSMESSAGES.STATUS_CODE.SUCCESS,
      SUCCESSMESSAGES.SUCCESS,
      paginatedResult
    )

  } catch (error) {
    return globalErrorHandler(error, "Get Paginated post");
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

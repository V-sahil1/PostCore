import type { Request, Response } from "express";
import * as commentService from "../service/comment.service";
import { SUCCESSMESSAGES, operationCreate, operationDelete, oprationUpdate, ERRORS, globalErrorHandler } from "../const/message";
import { sendSuccess } from "../utils/response.util";
import { AppError } from "../utils/errorHandler";
import type { AuthUser } from "../Interface/type";

/* ================= GET COMMENTS ================= */
export const getComment = async (
  _req: Request,
  res: Response
): Promise<Response> => {
  const data = await commentService.getAllCommentsService();
  return sendSuccess(
    res,
    SUCCESSMESSAGES.STATUS_CODE.SUCCESS,
    SUCCESSMESSAGES.SUCCESS,
    data

  )
};

/* ================= CREATE COMMENT ================= */
export const createComment = async (
  req: Request,
  res: Response
): Promise<Response | void> => {
  try {
    const user = req.user as AuthUser | undefined;
    const { description } = req.body;
    const postId = Number(req.params.postId);

    const result = await commentService.createCommentService(
      description,
      postId,
      user
    );

    return sendSuccess(
      res,
      SUCCESSMESSAGES.STATUS_CODE.SUCCESS,
      operationCreate("Comment"),
      result

    )
  } catch (error: unknown) {
    globalErrorHandler(error, "Create Comment")
    // res.status(500).json({ message: errorMessage(error) });
  }
};

/* ================= DELETE COMMENT ================= */
export const deleteComment = async (
  req: Request,
  res: Response
): Promise<Response | void> => {
  try {
    const user = req.user as AuthUser;
    if (!user) {
      throw new AppError(ERRORS.MESSAGES.UNAUTHORIZED, ERRORS.STATUS_CODE.UNAUTHORIZED)
    }
    console.log(user);

    const commentId = Number(req.params.commentId);
    const result = await commentService.deleteCommentService(commentId, user);
    return sendSuccess(
      res,
      SUCCESSMESSAGES.STATUS_CODE.SUCCESS,
      operationDelete("Comoment"),
      result

    )
  } catch (error) {
    globalErrorHandler(error, "Delete Comment")
  }
};

/* ================= UPDATE COMMENT ================= */
export const updateComment = async (
  req: Request,
  res: Response
): Promise<Response | void> => {
  try {
    const user = req.user as AuthUser;
    if (!user) {
      throw new AppError(ERRORS.MESSAGES.UNAUTHORIZED, ERRORS.STATUS_CODE.UNAUTHORIZED)
      //  res.status(401).json({ message: MESSAGES.UNAUTHORIZED });
    }

    const id = Number(req.params.commentId);

    const { description } = req.body;

    const data = await commentService.updateCommentService(
      id,
      description,
      user
    );

    return sendSuccess(
      res,
      SUCCESSMESSAGES.STATUS_CODE.SUCCESS,
      oprationUpdate("Comment"),
      data

    )
  } catch (error) {
    globalErrorHandler(error, "Upadate Comment")
    // return  senderror(
    //   res,
    //   500,
    //   errorMessage(error)

    // )
    // //  res.status(500).json({ message: errorMessage(error) });
  }
};

export const getCommentsByPost = async (
  req: Request,
  res: Response
): Promise<Response | void> => {
  try {
    const postId = Number(req.params.postId);
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const data = await commentService.getCommentsByPostService(
      postId,
      page,
      limit
    );

    return sendSuccess(
      res,
      SUCCESSMESSAGES.STATUS_CODE.SUCCESS,
      SUCCESSMESSAGES.SUCCESS,
      data
    )

  } catch (error) {
    globalErrorHandler(error, "Get Comment")
  }
};

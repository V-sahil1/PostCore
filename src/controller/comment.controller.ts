import type { Request, Response } from "express";
import * as commentService from "../service/comment.service";
import { MESSAGES, operationCreate, operationDelete, oprationUpdate } from "../const/message";
import { sendSuccess } from "../utils/response.util";
import { ERRORS, operationFailed } from "../const/error-message";
import { AppError } from "../utils/errorHandler";

type AuthUser = { id: number; role?: string };

/* ================= GET COMMENTS ================= */
export const getcomment = async (
  _req: Request,
  res: Response
): Promise<Response> => {
  const data = await commentService.getAllCommentsService();
  return sendSuccess(
    res,
    200,
    MESSAGES.SUCCESS,
    data

  )
};

/* ================= CREATE COMMENT ================= */
export const comment = async (
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
      200,
      operationCreate("Comment"),
      result

    )
  } catch (error: unknown) {
    operationFailed(error,"Create Comment")
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
    throw new AppError(ERRORS.message.UNAUTHORIZED,ERRORS.statusCode.UNAUTHORIZED)
    }
    console.log(user);

    const id = Number(req.params.commentId);
    const result = await commentService.deleteCommentService(id, user);
    return sendSuccess(
      res,
      200,
      operationDelete("Comoment"),
      result

    )
  } catch (error) {operationFailed(error,"Delete Comment") }
};

/* ================= UPDATE COMMENT ================= */
export const updateComment = async (
  req: Request,
  res: Response
): Promise<Response | void> => {
  try {
    const user = req.user as AuthUser;
    if (!user) {
     throw new AppError(ERRORS.message.UNAUTHORIZED,ERRORS.statusCode.UNAUTHORIZED)
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
      200,
      oprationUpdate("Comment"),
      data

    )
  } catch (error) {
    operationFailed(error,"Upadate Comment")
    // return  senderror(
    //   res,
    //   500,
    //   errorMessage(error)

    // )
    // //  res.status(500).json({ message: errorMessage(error) });
     }
};

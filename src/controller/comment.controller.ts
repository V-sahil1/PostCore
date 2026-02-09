import type { Request, Response } from "express";
import * as commentService from "../service/comment.service";
import { MESSAGES } from "../const/message";

type AuthUser = { id: number; role?: string };
function errorMessage(error: unknown): string { return error instanceof Error ? error.message : MESSAGES.INTERNAL_SERVER_ERROR; }

/* ================= GET COMMENTS ================= */
export const getcomment = async (
  _req: Request,
  res: Response
): Promise<Response> => {
  const data = await commentService.getAllCommentsService();
  return res.status(200).json(data);
};

/* ================= CREATE COMMENT ================= */
export const comment = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const user = req.user as AuthUser | undefined;
    const { description } = req.body;
    const postId = Number(req.params.postId);

    const result = await commentService.createCommentService(
      description,
      postId,
      user
    );

    return res.status(201).json(result);
  } catch (error: unknown) { return res.status(500).json({ message: errorMessage(error) }); }
};

/* ================= DELETE COMMENT ================= */
export const deletecomment = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const user = req.user as AuthUser;
    if (!user) {
      return res.status(401).json({ message: MESSAGES.UNAUTHORIZED });
    }

    const id = Number(req.params.delId);
    const result = await commentService.deleteCommentService(id, user);
    return res.status(200).json(result);
  } catch (error: unknown) { return res.status(500).json({ message: errorMessage(error) }); }
};

/* ================= UPDATE COMMENT ================= */
export const UpdateComment = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const user = req.user as AuthUser;
    if (!user) {
      return res.status(401).json({ message: MESSAGES.UNAUTHORIZED });
    }

    const id = Number(req.params.commentId);
    const { description } = req.body;

    const data = await commentService.updateCommentService(
      id,
      description,
      user
    );

    return res.status(200).json(data);
  } catch (error: unknown) { return res.status(500).json({ message: errorMessage(error) }); }
};

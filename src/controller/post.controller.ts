import type { Request, Response } from "express";
import * as postService from "../service/post.service";
import { MESSAGES } from "../const/message";

type AuthUser = { id: number; role?: string };
function errorMessage(error: unknown): string { return error instanceof Error ? error.message : MESSAGES.INTERNAL_SERVER_ERROR; }
/* ================= CREATE POST ================= */
export const creatpost = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const user = req.user as AuthUser;
    if (!user) {
      return res.status(401).json({ message: MESSAGES.UNAUTHORIZED });
    }

    const { title } = req.body;
    const result = await postService.createPostService(title, user);
    return res.status(201).json(result);
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
    return res.status(200).json(data);
  } catch (error: unknown) { return res.status(500).json({ message: errorMessage(error) }); }
};

/* ================= GET ALL POSTS ================= */
export const getpost = async (
  _req: Request,
  res: Response
): Promise<Response> => {
  const data = await postService.getAllPostsService();
  return res.status(200).json(data);
};

/* ================= GET POST BY ID ================= */
export const getpostById = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const id = Number(req.params.pid);
    const data = await postService.getPostByIdService(id);
    return res.status(200).json(data);
  } catch (error: unknown) { return res.status(500).json({ message: errorMessage(error) }); }
};

/* ================= DELETE POST ================= */
export const postDelete = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const user = req.user as AuthUser;
    if (!user) {
      return res.status(401).json({ message: MESSAGES.UNAUTHORIZED });
    }

    const id = Number(req.params.delId);
    const result = await postService.deletePostService(id, user);
    return res.status(200).json(result);
  } catch (error: unknown) { return res.status(500).json({ message: errorMessage(error) }); }
};

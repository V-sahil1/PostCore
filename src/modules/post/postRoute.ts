import db from "../../models/index";
import type { Request, Response } from "express";

const Post = db.post;

type AuthUser = { id: number; role?: string; email?: string };

export const creatpost = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const user = req.user as unknown as AuthUser | undefined;

    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { title } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    const post = await Post.create({
      title,
      user_id: user.id,
    });

    return res.status(201).json({
      message: "Post created successfully",
      post,
    });
  } catch {
    return res.status(500).json({
      message: "Failed to create post",
    });
  }
};

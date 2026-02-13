import { ERRORS } from "../const/error-message";
import {  operationCreate, operationDelete } from "../const/message";
import db from "../database/models";
import { AppError } from "../utils/errorHandler";

const Comment = db.comment;
const Post = db.post;
const message =ERRORS.message;
const statusCode = ERRORS.statusCode;

type AuthUser = { id: number; role?: string };
type CommentRow = { user_id: number };

/* ================= GET ALL COMMENTS ================= */
export const getAllCommentsService = async () => {
  return await Comment.findAll();
};

/* ================= CREATE COMMENT ================= */
export const createCommentService = async (
  description: string,
  postId: number,
  user?: AuthUser
) => {
  if (!description) {
    throw new AppError(message.NOT_FOUND("Description"),statusCode.NOT_FOUND);
  }
 const post = await Post.findByPk(postId);
 if(!post){
   throw new AppError(message.NOT_FOUND("Post"),statusCode.NOT_FOUND);
 }

  const comment = await Comment.create({
    description,
    user_id: user ? user.id : null, // guest allowed
    is_guest: !user,
    post_id: postId,
  });

  return {
    message: operationCreate("Comment"),
    comment,
  };
};

/* ================= DELETE COMMENT ================= */
export const deleteCommentService = async (
  commentId: number,
  user: AuthUser
) => {
  const comment = await Comment.findByPk(commentId);
  if (!comment) {
    throw new AppError(message.NOT_FOUND("Comment"),statusCode.NOT_FOUND);
  }

  const commentRow = comment as unknown as CommentRow;

  if (commentRow.user_id !== user.id && user.role !== "admin") {
    throw new AppError(message.UNAUTHORIZED,statusCode.UNAUTHORIZED);
  }

  await comment.destroy();
  return { message: operationDelete("Comment")};
};

/* ================= UPDATE COMMENT ================= */
export const updateCommentService = async (
  id: number,
  description: string,
  user: AuthUser
) => {
  console.log(id);
  if (!description) {
    // throw new Error("Comment is required");
    throw new AppError(message.NOT_FOUND("Description"),statusCode.NOT_FOUND);
  }

  const comment = await Comment.findByPk(id);
  if (!comment) {
    throw new AppError(message.NOT_FOUND("Comment"),statusCode.NOT_FOUND);
  }

  if (comment.user_id !== user.id && user.role !== "admin") {
    // throw new Error("Not authorized to update comment");
    throw new AppError(message.UNAUTHORIZED,statusCode.UNAUTHORIZED);
  }

  await comment.update({ description });
  return comment;
};

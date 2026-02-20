import { model } from "mongoose";
import { ERRORS } from "../const/error-message";
import { operationCreate, operationDelete } from "../const/message";
import { comment } from "../controller/comment.controller";
import db from "../database/models";
import { AppError } from "../utils/errorHandler";
import { User } from "../database/models/user";
import { USER_ROLES } from "../const/user-role";

const Comment = db.comment;
const Post = db.post;
const message = ERRORS.MESSAGES;
const statusCode = ERRORS.STATUS_CODE;

type AuthUser = { id: number; role?: string };
type CommentRow = { user_id: number };

/* ================= GET ALL COMMENTS ================= */
export const getAllCommentsService = async (): Promise<void> => {
  return await Comment.findAll();
};

/* ================= CREATE COMMENT ================= */
export const createCommentService = async (
  description: string,
  postId: number,
  user?: AuthUser
) => {
  if (!description) {
    throw new AppError(message.NOT_FOUND("Description"), statusCode.NOT_FOUND);
  }
  const post = await Post.findByPk(postId);
  if (!post) {
    throw new AppError(message.NOT_FOUND("Post"), statusCode.NOT_FOUND);
  }

  const comment = await Comment.create({
    description,
    user_id: user ? user.id : null, // guest allowed
    is_guest: !user,
    post_id: postId,
  });
  const commentData = comment.toJSON();

  const { _id, _user_id, _post_id, _is_guest, ...cleanPost } = commentData;

  return {
    message: operationCreate("Comment"),
    cleanPost,
  };
};

/* ================= DELETE COMMENT ================= */
export const deleteCommentService = async (
  commentId: number,
  user: AuthUser
) => {
  const comment = await Comment.findByPk(commentId);
  if (!comment) {
    throw new AppError(message.NOT_FOUND("Comment"), statusCode.NOT_FOUND);
  }

  const commentRow = comment as unknown as CommentRow;

  if (commentRow.user_id !== user.id && user.role !== "admin") {
    throw new AppError(message.UNAUTHORIZED, statusCode.UNAUTHORIZED);
  }

  await comment.destroy();
  return { message: operationDelete("Comment") };
};

/* ================= UPDATE COMMENT ================= */
export const updateCommentService = async (
  commentid: number,
  description: string,
  user: AuthUser
) => {
  console.log(commentid);
  if (!description) {
    // throw new Error("Comment is required");
    throw new AppError(message.NOT_FOUND("Description"), statusCode.NOT_FOUND);
  }

  const comment = await Comment.findByPk(commentid);
  if (!comment) {
    throw new AppError(message.NOT_FOUND("Comment"), statusCode.NOT_FOUND);
  }

  if (comment.user_id !== user.id && user.role !== USER_ROLES.ADMIN) {
    // throw new Error("Not authorized to update comment");
    throw new AppError(message.UNAUTHORIZED, statusCode.UNAUTHORIZED);
  }

  await comment.update({ description });
  const postData = comment.toJSON();
  const { id, user_id, post_id, is_guest, ...cleanPost } = postData;
  return cleanPost;
};

export const getCommentsByPostService = async (
  postId: number,
  page: number,
  limit: number
) => {

  const offset = (page - 1) * limit;
  const post = await db.post.findByPk(postId);
  if (!post) {
    throw new AppError(
      message.NOT_FOUND("Post"),
      statusCode.NOT_FOUND
    );
  }

  const { count, rows } = await db.comment.findAndCountAll({
    where: { post_id: postId }, // ✅ filter by post
    limit,
    offset,
    order: [["createdAt", "DESC"]],
    attributes: {
      exclude: ["id", "is_guest", "post_id", "user_id"]
    },
    include: [
      {
        model: User,
        attributes: ["user_name"],
      },
    ]

  });
  console.log(rows);
  console.log(count);

  const comments = rows.map((comment :(typeof rows)[0]) => {
    const { user, ...rest } = comment.toJSON();
    return {
      ...rest,
      user_name: user?.user_name,
    };
  });
  console.log(comments);

  return {
    totalItems: count,
    totalPages: Math.ceil(count / limit),
    currentPage: page,
    comments,
  };
};

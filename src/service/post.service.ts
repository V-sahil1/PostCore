import { ERRORS } from "../const/error-message";
import { operationCreate, operationDelete } from "../const/message";
import db from "../database/models";
import { AppError } from "../utils/errorHandler";

const Post = db.post;
const User = db.user;
const Comment = db.comment;
const message = ERRORS.message;
const statusCode = ERRORS.statusCode

type AuthUser = { id: number; role?: string };
type IdRow = { id: number };
type PostRow = { user_id: number };

/* ================= CREATE POST ================= */
export const createPostService = async (
  title: string,
  user: AuthUser
) => {
  if (!title) {
    // throw new Error("Title is required");
    throw new AppError(message.NOT_FOUND("Title"), statusCode.NOT_FOUND);
  }

  const post = await Post.create({
    title,
    user_id: user.id,
  });

  return {
    // message: "Post created successfully",
    message: operationCreate("Post"),
    post,
  };
};

/* ================= UPDATE POST ================= */
export const updatePostService = async (
  postId: number,
  title: string,
  user: AuthUser
) => {
  const post = await Post.findByPk(postId);
  if (!post) {
    // throw new Error("Post not found");
    throw new AppError(message.NOT_FOUND("Post"), statusCode.NOT_FOUND);
  }

  const postRow = post as unknown as PostRow;

  if (postRow.user_id !== user.id && user.role !== "admin") {
    // throw new Error("Not authorized to update post");
    throw new AppError(message.UNAUTHORIZED, statusCode.UNAUTHORIZED);
  }

  await post.update({ title });
  return post;
};

/* ================= GET ALL POSTS ================= */
export const getAllPostsService = async () => {
  return await Post.findAll({
    attributes: ["title"],
    include: [
      {
        model: User,
        as: "UserInfo",
        attributes: ["user_name", "email"],
      },
      {
        model: Comment,
      },
    ],
  });
};

/* ================= GET POST BY ID ================= */
export const getPostByIdService = async (id: number) => {
  const post = await Post.findByPk(id);
  if (!post) {
    throw new AppError(message.NOT_FOUND("Post"), statusCode.NOT_FOUND)
  }
  return post;
};

/* ================= DELETE POST ================= */
export const deletePostService = async (
  postId: number,
  user: AuthUser
) => {
  const post = await Post.findByPk(postId);
  if (!post) {
    throw new AppError(message.NOT_FOUND("Post"), statusCode.NOT_FOUND);
  }

  const postRow = post as unknown as PostRow;

  if (postRow.user_id !== user.id) {
    throw new AppError(message.UNAUTHORIZED, statusCode.UNAUTHORIZED);
  }

  const comments = await Comment.findAll({
    where: { post_id: postId },
  });

  const commentIds = comments.map(
    (item: number) => (item as unknown as IdRow).id
  );

  if (commentIds.length > 0) {
    await Comment.destroy({ where: { id: commentIds } });
  }

  await post.destroy();
  return { message: operationDelete("Post") };
};

import { MESSAGES, operationCreate, operationDelete, oprationNoteFound } from "../const/message";
import db from "../database/models";

const Post = db.post;
const User = db.user;
const Comment = db.comment;

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
    throw new Error(MESSAGES.REQUIRED);
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
    throw new Error(oprationNoteFound("Post"));
  }

  const postRow = post as unknown as PostRow;

  if (postRow.user_id !== user.id && user.role !== "admin") {
    // throw new Error("Not authorized to update post");
    throw new Error(MESSAGES.UNAUTHORIZED);
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
    throw new Error(oprationNoteFound("Post"));
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
    throw new Error(oprationNoteFound("Post"));
  }

  const postRow = post as unknown as PostRow;

  if (postRow.user_id !== user.id) {
    throw new Error(MESSAGES.UNAUTHORIZED);
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
  return { message: operationDelete("Post")};
};

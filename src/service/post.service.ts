import { operationCreate, operationDelete, ERRORS } from "../const/message";
import db from "../database/models";
import { AppError } from "../utils/errorHandler";
import { USER_ROLES } from "../const/enum";
import type { AuthUser, IdRow } from "../Interface/type"
import { type Includeable, Op } from "sequelize";
const Post = db.post;
const User = db.user;
const Comment = db.comment;
const message = ERRORS.MESSAGES;
const statusCode = ERRORS.STATUS_CODE

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
  const postData = post.toJSON();

  const { id, user_id, ...cleanPost } = postData;

  return {
    // message: "Post created successfully",
    message: operationCreate("Post"),
    post: cleanPost,
  };
};

/* ================= UPDATE POST ================= */
export const updatePostService = async (
  postId: number,
  title: string,
  user: AuthUser
) => {
  const post = await Post.findByPk(postId

  );
  if (!post) {
    // throw new Error("Post not found");
    throw new AppError(message.NOT_FOUND("Post"), statusCode.NOT_FOUND);
  }

  if (post.user_id !== user.id && user.role !== USER_ROLES.ADMIN) {
    // throw new Error("Not authorized to update post");
    throw new AppError(message.UNAUTHORIZED, statusCode.UNAUTHORIZED);
  }

  await post.update({ title });
  const postData = post.toJSON();
  const { id, user_id, ...cleanPost } = postData;

  return cleanPost;
};

/* ================= GET ALL POSTS ================= */
// export const getAllPostsService = async () => {
//   return await Post.findAll({
//     attributes: ["title"],
//     include: [
//       {
//         model: User,
//         as: "UserInfo",
//         attributes: ["user_name", "email"],
//       },
//       {
//         model: Comment,
//       },
//     ],
//   });
// };

/* ================= GET POST BY ID ================= */
export const getPostByIdService = async (id: number) => {
  const post = await Post.findByPk(id, {
    attributes: { exclude: ["id", "user_id"] },
    include: {
      model: Comment,
      attributes: { exclude: ["id", "user_id", "is_guest", "post_id"] },
    },

  });
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

  if (post.user_id !== user.id) {
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

// -----------------------------------------Post paggination-----------------------------------
export const getPaginatedPostService = async (
  limit: number,
  lastCreatedAt?: Date,
  commentFlag?: boolean
) => {
  const whereCondition = lastCreatedAt
    ? {
      createdAt: {
        [Op.lt]: lastCreatedAt,
      },
    }

    : {};

  const includeOptions: Includeable[] = [
    {
      model: User,
      as: "UserInfo",
      attributes: ["user_name", "email"],
    },
  ];

  if (commentFlag) {
    includeOptions.push({
      model: Comment,
      separate: true,
      attributes: { exclude: ["user_id", "post_id", "is_guest"] },
    });
  }

  const posts = await Post.findAll({
    where: whereCondition,
    order: [["createdAt", "DESC"]],
    limit,
    include: includeOptions,
  });

  const lastPost = posts[posts.length - 1];
  const nextCursor = lastPost?.createdAt ?? null;
  return {
    data: posts,
    nextCursor,
  };
};
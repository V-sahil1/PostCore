import { MESSAGES, operationCreate, operationDelete, oprationNoteFound, oprationRequired } from "../const/message";
import db from "../database/models";

const Comment = db.comment;
const Post = db.post;

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
    throw new Error(oprationRequired("Description"));
  }
 const post = await Post.findByPk(postId);
 if(!post){
   throw new Error(oprationNoteFound("Post"));
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
    throw new Error(oprationRequired("Comment"));
  }

  const commentRow = comment as unknown as CommentRow;

  if (commentRow.user_id !== user.id && user.role !== "admin") {
    throw new Error(MESSAGES.FORBIDDEN);
  }

  await comment.destroy();
  return { message: operationDelete("Comment")};
};

/* ================= UPDATE COMMENT ================= */
export const updateCommentService = async (
  commentId: number,
  description: string,
  user: AuthUser
) => {
  if (!description) {
    // throw new Error("Comment is required");
    throw new Error(oprationRequired("Description"));
  }

  const comment = await Comment.findByPk(commentId);
  if (!comment) {
    throw new Error(oprationNoteFound("Comment"));
  }

  const commentRow = comment as unknown as CommentRow;

  if (commentRow.user_id !== user.id && user.role !== "admin") {
    // throw new Error("Not authorized to update comment");
    throw new Error(MESSAGES.UNAUTHORIZED);
  }

  await comment.update({ description });
  return comment;
};

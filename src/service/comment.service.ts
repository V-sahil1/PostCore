import db from "../database/models";

const Comment = db.comment;

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
    throw new Error("Description is required");
  }

  const comment = await Comment.create({
    description,
    user_id: user ? user.id : null, // guest allowed
    is_guest: !user,
    post_id: postId,
  });

  return {
    message: "Comment created successfully",
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
    throw new Error("Comment not found");
  }

  const commentRow = comment as unknown as CommentRow;

  if (commentRow.user_id !== user.id && user.role !== "admin") {
    throw new Error("Not authorized to delete comment");
  }

  await comment.destroy();
  return { message: "Comment deleted successfully" };
};

/* ================= UPDATE COMMENT ================= */
export const updateCommentService = async (
  commentId: number,
  description: string,
  user: AuthUser
) => {
  if (!description) {
    throw new Error("Comment is required");
  }

  const comment = await Comment.findByPk(commentId);
  if (!comment) {
    throw new Error("Comment not found");
  }

  const commentRow = comment as unknown as CommentRow;

  if (commentRow.user_id !== user.id && user.role !== "admin") {
    throw new Error("Not authorized to update comment");
  }

  await comment.update({ description });
  return comment;
};

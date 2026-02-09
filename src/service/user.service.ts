import db from "../database/models";
import bcrypt from "bcrypt";
import { MESSAGES } from "../const/message";

const User = db.user;
const Post = db.post;
const Comment = db.comment;

type AuthUser = {
  id: number;
  role?: string;
};

type IdRow = { id: number };

/* ================= DELETE USER ================= */
export const deleteUserService = async (
  targetUserId: number,
  authUser: AuthUser
) => {
  if (!authUser) {
    throw new Error(MESSAGES.UNAUTHORIZED);
  }

  const user = await User.findByPk(targetUserId);
  if (!user) {
    throw new Error(MESSAGES.USER_NOT_FOUND);
  }

  if (authUser.id !== targetUserId && authUser.role !== "admin") {
    throw new Error(MESSAGES.FORBIDDEN);
  }

  const comments = await Comment.findAll({
    where: { user_id: targetUserId },
  });

  const commentIds = comments.map(
    (item: unknown) => (item as IdRow).id
  );

  if (commentIds.length > 0) {
    await Comment.destroy({ where: { id: commentIds } });
  }

  const posts = await Post.findAll({
    where: { user_id: targetUserId },
  });

  const postIds = posts.map(
    (item: unknown) => (item as IdRow).id
  );

  if (postIds.length > 0) {
    await Post.destroy({ where: { id: postIds } });
  }

  await User.destroy({ where: { id: targetUserId } });

  return { message: MESSAGES.USER_DELETED_SUCCESSFULLY };
};

/* ================= REGISTER ================= */
export const registerUserService = async (
  user_name: string,
  email: string,
  password: string,
  role?: string,
  age?: number
) => {
  if (!user_name || !email || !password) {
    throw new Error(MESSAGES.REQUIRED);
  }

  const hash = await bcrypt.hash(password, 10);

  const user = await User.create({
    user_name,
    email,
    password: hash,
    role,
    age,
  });

  const createdUser = user as unknown as {
    id: number;
    user_name: string;
    email: string;
    role: string;
    age: number;
  };

  return {
    message: MESSAGES.REGISTER_SUCCESS,
    user: {
      id: createdUser.id,
      user_name: createdUser.user_name,
      email: createdUser.email,
      role: createdUser.role,
      age: createdUser.age,
    },
  };
};

/* ================= LOGIN ================= */
export const loginUserService = async (email: string, password: string) => {
  if (!email || !password) {
    throw new Error(MESSAGES.REQUIRED);
  }

  const user = await User.findOne({ where: { email } });
  if (!user) {
    throw new Error(MESSAGES.INVALID_CREDENTIALS);
  }

  const foundUser = user as unknown as {
    id: number;
    email: string;
    role: string;
    password: string;
  };

  const isMatch = await bcrypt.compare(password, foundUser.password);
  if (!isMatch) {
    throw new Error(MESSAGES.INVALID_CREDENTIALS);
  }

  return {
    message: MESSAGES.LOGIN_SUCCESS,
    user: {
      id: foundUser.id,
      email: foundUser.email,
      role: foundUser.role,
    },
  };
};

/* ================= GET ALL USERS ================= */
export const getAllUserService = async () => {
  return await User.findAll({
    attributes: ["id", "user_name", "email", "role", "age"],
  });
};
export const updateUserService = async (
  userId: number,
  user_name:string,
  email:string,
  password:string,
  role:string,
  age:string
) => {
  const user = await User.findByPk(userId);
  if (!user) {
    // throw new Error("Post not found");
    throw new Error(MESSAGES.POST_NOT_FOUND);
  }

  const userRow = user ;

  if (userRow.id !== user.id ) {
    // throw new Error("Not authorized to update post");
    throw new Error(MESSAGES.UNAUTHORIZED);
  }

  await user.update({ user_name,email,password,role,age });
  return user;
};

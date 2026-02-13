import db from "../database/models";
import bcrypt from "bcrypt";
import { MESSAGES, operationCreate, operationDelete } from "../const/message";
import { USER_ROLES, UserRole } from "../const/user-role";
import { AppError } from "../utils/errorHandler";
import { ERRORS, operationFailed } from "../const/error-message";
import { Request, Response } from "express";

const User = db.user;
const Post = db.post;
const Comment = db.comment;

const message = ERRORS.message;
const statusCode = ERRORS.statusCode;
type AuthUser = {
  id: number;
  role?: UserRole;
};

type IdRow = { id: number };

/* ================= DELETE USER ================= */
export const deleteUserService = async (
  targetUserId: number,
  authUser: AuthUser
) => {
  if (!authUser) {
    throw new AppError(message.UNAUTHORIZED, statusCode.UNAUTHORIZED);
  }

  const user = await User.findByPk(targetUserId);
  if (!user) {
    throw new AppError(message.NOT_FOUND("User"), statusCode.NOT_FOUND);
  }

  if (authUser.id !== targetUserId && authUser.role !== "admin") {
  throw new AppError(message.UNAUTHORIZED, statusCode.UNAUTHORIZED);
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

  return { message: operationDelete("User") };
};

/* ================= REGISTER ================= */
export const registerUserService = async (
  user_name: string,
  email: string,
  password: string,
  age?: number
) => {
  if (!user_name || !email || !password) {
    throw new AppError(message.ALL_FIELDS_REQUIRED,statusCode.ALL_FIELDS_REQUIRED,);
  }
const existingUser = await db.user.findOne({ where: { email } });

if (existingUser) {
  throw new AppError(message.CONFLICT("User"), 400);
}

  const hash = await bcrypt.hash(password, 10);

  const user = await User.create({
    user_name,
    email,
    password: hash,
    role: USER_ROLES.USER,
   ...(age !== undefined && { age })
  });

  const createdUser = user as unknown as {
    id: number;
    user_name: string;
    email: string;
    role: UserRole;
    age: number;
  };

  return {
    message: operationCreate("User"),
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
    throw new AppError(MESSAGES.REQUIRED, 404);
  }

  const user = await db.user.findOne({ where: { email } });
  if (!user) {
    throw new AppError(message.INVALID("Email"), statusCode.UNAUTHORIZED);
  }

  const foundUser = user as unknown as {
    id: number;
    email: string;
    role: string;
    password: string;
  };

  const isMatch = await bcrypt.compare(password, foundUser.password);
  if (!isMatch) {
    throw new AppError(message.INVALID("Password"),  statusCode.UNAUTHORIZED);
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
 export const getAllUserService = async (
  userId: number,
  authUser: AuthUser
) => {
  const user = await User.findByPk(userId);

  if (!user) {
    throw new AppError(message.INVALID("User"), statusCode.UNAUTHORIZED);
  }

  // Allow only:
  // 1. Admin
  // 2. Owner (same user)
  if (
    authUser.role !== USER_ROLES.ADMIN &&
    authUser.id !== user.id
  ) {
    throw new AppError(message.UNAUTHORIZED, statusCode.UNAUTHORIZED);
  }

  return user;
};

export const updateUserService = async (
  userId: number,
  authUser: AuthUser,
  user_name: string,
  email: string,
  password: string,
  age: number
) => {
  const user = await User.findByPk(userId);
  if (!user) {
    // throw new Error("Post not found");
    throw new AppError(message.NOT_FOUND("UserId"), statusCode.NOT_FOUND);
  }

  if (authUser.id!==user.id &&authUser.role !== USER_ROLES.ADMIN) {
    throw new AppError(message.UNAUTHORIZED, statusCode.NOT_FOUND);
  }

  if (!user) {
    throw new AppError(message.NOT_FOUND("User Not Found!"), statusCode.NOT_FOUND);
  }

  await user.update({ user_name, email, password, age });
  return user;
};

//  -----------------------------------User pageggnation - ------------------------------------
export const getPaginatedUsers
 = async (req: Request, res: Response) => {
  try {
        const page = Math.max(parseInt(req.query.page as string) || 1, 1);
    const limit = Math.max(parseInt(req.query.limit as string) || 10, 1);
    const offset = (page - 1) * limit;

    const { count, rows } = await User.findAndCountAll({
      limit,
      offset,
    });

    return res.status(200).json({
      totalUsers: count,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      users: rows,
    });

  } catch (error) {
    operationFailed(error,"Paginated Users")
  }
};

import db from "../database/models";
import bcrypt from "bcrypt";
import { MESSAGES, operationCreate, operationDelete } from "../const/message";
import type { UserRole } from "../const/user-role";
import { USER_ROLES } from "../const/user-role";
import { AppError } from "../utils/errorHandler";
import { ERRORS, globalErrorHandler } from "../const/error-message";
import type { IncludeOptions } from "sequelize";
import { Order } from "sequelize";
// import { User } from "../database/models/user";

const User = db.user;
const Post = db.post;
const Comment = db.comment;
interface IUserAttributes {
  id: number;
  user_name: string;
  email: string;
  password: string;
  role: UserRole;
  age?: number;
}

const message = ERRORS.MESSAGES;
const statusCode = ERRORS.STATUS_CODE;
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
    throw new AppError(message.ALL_FIELDS_REQUIRED, statusCode.ALL_FIELDS_REQUIRED,);
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

  return {
    message: operationCreate("User"),
    user: {
      id: user.id,
      user_name: user.user_name,
      email: user.email,
      role: user.role,
      age: user.age,
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

  // const foundUser = user as unknown as {
  //   id: number;
  //   email: string;
  //   role: UserRole;
  //   password: string;
  // };

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new AppError(message.INVALID("Password"), statusCode.UNAUTHORIZED);
  }

  return {
    message: MESSAGES.LOGIN_SUCCESS,
    user: {
      id: user.id,
      user_name: user.user_name,
      email: user.email,

      role: user.role,
    },
  };
};

/* ================= GET ALL USERS ================= */
export const getAllUserService = async (
  userId: number,
  authUser: AuthUser
) => {

  const user = await User.findByPk(userId, {
    attributes: { exclude: ["password", "id"] },
  });

  if (!user) {
    throw new AppError(message.INVALID("User"), statusCode.NOT_FOUND);
  }

  if (
    authUser.role !== USER_ROLES.ADMIN &&
    authUser.id !== userId
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

  if (authUser.id !== user.id && authUser.role !== USER_ROLES.ADMIN) {
    throw new AppError(message.UNAUTHORIZED, statusCode.NOT_FOUND);
  }

  if (!user) {
    throw new AppError(message.NOT_FOUND("User Not Found!"), statusCode.NOT_FOUND);
  }

  await user.update({ user_name, email, password, age });
  return user;
};

//  -----------------------------------User pageggnation - ------------------------------------
type SortBy = "ASC" | "DESC";

export const getPaginatedUsers = async (
  page: number,
  limit: number,
  sortBy: SortBy
) => {
  const offset = (page - 1) * limit;
  const order: Order = [["createdAt", sortBy]];

  const { count, rows } = await User.findAndCountAll({
    limit,
    offset,
    attributes: { exclude: ["password", "id"] },
    order,
  });

  return {
    totalUsers: count,
    totalPages: Math.ceil(count / limit),
    currentPage: page,
    users: rows,
  };
};
// export const updateUserProfileService = async (
//   id: number,
//   updateData: {
//     user_name?: string;
//     email?: string;
//     password?: string;
//   }
// ) => {
//   const user = await db.user.findByPk(id)

//   if (!user) {
//     throw new AppError(
//       message.NOT_FOUND("User"),
//       statusCode.NOT_FOUND
//     );
//   }

//   const { user_name, email, password } = updateData;

//   if (!user_name && !email && !password) {
//     throw new AppError(
//       ERRORS.message.REQUIRE("At least one field to update"),
//       ERRORS.statusCode.ALL_FIELDS_REQUIRED
//     );
//   }

//   // Check email uniqueness
//   if (email && email !== user.email) {
//     const user = await db.user.findOne({ where: { email } });
//     if (user) {
//       throw new AppError(
//         message.CONFLICT("Email"),
//         statusCode.CONFLICT
//       );
//     }
//   }

//   const dataToUpdate: Partial<IUserAttributes> = {};

//   if (user_name !== undefined) dataToUpdate.user_name = user_name;
//   if (email !== undefined) dataToUpdate.email = email;

//   if (password !== undefined) {
//     dataToUpdate.password = await bcrypt.hash(password,10 );
//   }

//   const updatedUser = await user.update(dataToUpdate);

//   return updatedUser;
// };

export const updateUserProfileService = async (
  id: number,
  updateData: {
    user_name?: string;
    email?: string;
    password?: string;
  }
) => {
  const user = await db.user.findByPk(id);

  if (!user) {
    throw new AppError(
      message.NOT_FOUND("User"),
      statusCode.NOT_FOUND
    );
  }

  const { user_name, email, password } = updateData;

  if (!user_name && !email && !password) {
    throw new AppError(
      message.REQUIRE("At least one field to update"),
      statusCode.ALL_FIELDS_REQUIRED
    );
  }

  // ✅ Fixed: only check email uniqueness if email is actually being updated
  if (email !== undefined) {
    const existingUser = await db.user.findOne({ where: { email } });

    if (existingUser && existingUser.id !== id) {
      throw new AppError(
        message.CONFLICT("Email"),
        statusCode.CONFLICT
      );
    }
  }

  const dataToUpdate: Partial<IUserAttributes> = {};

  if (user_name !== undefined) {
    dataToUpdate.user_name = user_name;
  }
  if (email !== undefined) {
    dataToUpdate.email = email;
  }

  if (password !== undefined) {
    dataToUpdate.password = await bcrypt.hash(password, 10);
  }

  const updatedUser = await user.update(dataToUpdate);

  return updatedUser;
};

// -------------------------------------------- User-post -comment Paginated----------------------------------------

export const overviewService = async (
  page: number,
  limit: number,
  commentFlag: boolean
) => {

  const offset = (page - 1) * limit;

  const postInclude: IncludeOptions = {
    model: Post,
    as: "postDetails",
    attributes: { exclude: ["id", "user_id"] },
  };

  if (commentFlag) {
    postInclude.include = [
      {
        model: Comment,
        attributes: {
          exclude: ["id", "user_id", "post_id", "is_guest"],
        },
      },
    ];
  }

  const users = await User.findAndCountAll({
    limit,
    offset,
    attributes: { exclude: ["password", "id"] },
    distinct: true,
    include: [postInclude],
    order: [["id", "ASC"]],
  });

  return {
    totalUsers: users.count,
    totalPages: Math.ceil(users.count / limit),
    currentPage: page,
    data: users.rows,
  };
};

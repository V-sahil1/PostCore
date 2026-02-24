import type { Request, Response } from "express";
import * as userService from "../service/user.service";
import { SUCCESSMESSAGES, operationDelete, oprationUpdate, ERRORS, globalErrorHandler } from "../const/message";
import { env } from "../config/env.config";

import { sendSuccess } from "../utils/response.util";
import { AppError } from "../utils/errorHandler";
import type { AuthUser } from "../Interface/type";

// ----------------------------------------TYPES ----------------------------------------------
// type AuthUser = {
//   id: number;
//   role?: UserRole;
//   email?: string;
// };

const message = ERRORS.MESSAGES;
const statusCode = ERRORS.STATUS_CODE;
// ---------------------------------------- JWT ----------------------------------------------
const JWT_SECRET = env.JWT.JWT_SECRET;
if (!JWT_SECRET) {
  throw new AppError(message.NOT_FOUND("JWT Token"), statusCode.NOT_FOUND);
}

// ---------------------------------------- DELETE USER  ----------------------------------------------

export const deleteUser = async (
  req: Request,
  res: Response
): Promise<Response | void> => {
  try {
    const authUser = req.user as AuthUser;
    const userId = Number(req.params.userId);

    const result = await userService.deleteUserService(userId, authUser);
    // console.log(res);

    return sendSuccess(
      res,
      SUCCESSMESSAGES.STATUS_CODE.SUCCESS, operationDelete("User"),
      result

    );
    // res.status(200).json(result);
  } catch (error) {
    globalErrorHandler(error, "Delete User")
  }
};

// ---------------------------------------- GET ALL USERS  ----------------------------------------------

export const getUser = async (
  req: Request,
  res: Response
): Promise<Response | void> => {
  try {
    const authUser = req.user as AuthUser;
    const userId = Number(req.params.userId);

    const result = await userService.getAllUserService(userId, authUser);
    console.log(result);

    return sendSuccess(
      res,
      SUCCESSMESSAGES.STATUS_CODE.SUCCESS,
      SUCCESSMESSAGES.SUCCESS,
      result,

    );

  } catch (error: unknown) {

    globalErrorHandler(error, "Get User!");
  }
};

// ---------------------------------------- UPDATE USER  ----------------------------------------------

export const updateUserProfile = async (
  req: Request,
  res: Response
): Promise<Response | void> => {
  try {
    const authenticatedUser = req.user as AuthUser;

    if (!authenticatedUser) {
      throw new AppError(
        message.UNAUTHORIZED,
        statusCode.UNAUTHORIZED
      );
    }

    const userid = Number(req.params.userId);

    const updatedUser = await userService.updateUserProfileService(
      userid,
      req.body
    );

    const { password: _, id, ...userWithoutPassword } = updatedUser.toJSON();

    return sendSuccess(
      res,
      SUCCESSMESSAGES.STATUS_CODE.SUCCESS,
      oprationUpdate("User"),
      userWithoutPassword
    );
  } catch (error) {
    return globalErrorHandler(error, "Update User");
  }
};

export const getUserPostsWithComments = async (
  req: Request,
  res: Response
): Promise<Response | void> => {
  try {

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 5;
    const commentFlag = req.query.comment === "true";
    const postFlag = req.query.post === "true";
    const sortBy = (req.query.orderBy as "ASC" | "DESC") || "ASC";
    const { minAge, maxAge } = req.body;
    const paginatedResult = await userService.getUserPostCommentService(page, limit, commentFlag, postFlag, sortBy, minAge, maxAge);

    return sendSuccess(
      res,
      SUCCESSMESSAGES.STATUS_CODE.SUCCESS,
      SUCCESSMESSAGES.SUCCESS,
      paginatedResult
    )

  } catch (error) {
    return globalErrorHandler(error, "Get Paginated Users");
  }
};

export const getPaginated = async (req: Request, res: Response) => {
  try {
    const page = Math.max(parseInt(req.query.page as string) || 1, 1);
    const limit = Math.max(parseInt(req.query.limit as string) || 10, 1);
    const sortBy = (req.query.orderBy as "ASC" | "DESC") || "ASC";

    const { minAge, maxAge } = req.body;

    const paginate = await userService.getPaginatedUsers(page, limit, sortBy, minAge, maxAge);

    return sendSuccess(
      res,
      SUCCESSMESSAGES.STATUS_CODE.SUCCESS,
      SUCCESSMESSAGES.SUCCESS,
      paginate
    );
  } catch (error) {
    globalErrorHandler(error, "Paginated Users");
  }
};
// ----------------------------------------REGISTER  ----------------------------------------------

// export const register = async (
//   req: Request,
//   res: Response
// ): Promise<Response | void> => {
//   try {
//     const { user_name, email, password,  age } = req.body;

//     if (!user_name || !email || !password) {
//       // const m =new AppError(MESSAGES.REQUIRED,404)
//       throw new AppError(message.ALL_FIELDS_REQUIRED, statusCode.ALL_FIELDS_REQUIRED);
//     }

//     const result = await userService.registerUserService(
//       user_name,
//       email,
//       password,
//       age
//     );

//     const token = jwt.sign(
//       {
//         id: result.user.id,
//         email: result.user.email,
//         role: result.user.role,
//       },
//       JWT_SECRET,
//       { expiresIn: "1d" }
//     );
//     const { id, ...userWithoutId } = result.user;
//     // console.log(res);

//     return sendSuccess(
//       res,
//       MESSAGES.STATUS_CODE.SUCCESS,
//       operationCreate("User"),
//       userWithoutId,
//       token
//     );
//   } catch (error) {
//     // console.log(error)
//     globalErrorHandler(error, "Register User")
//   }
// }

// // ----------------------------------------LOGIN  ----------------------------------------------

// export const login = async (
//   req: Request,
//   res: Response
// ): Promise<Response | void> => {
//   try {
//     const { email, password } = req.body;

//     const result = await userService.loginUserService(email, password);
//     if (!email || !password) {
//       // const m =new AppError(MESSAGES.REQUIRED,404)
//       throw new AppError(message.ALL_FIELDS_REQUIRED, statusCode.ALL_FIELDS_REQUIRED);
//     }

//     const token = jwt.sign(
//       {
//         id: result.user.id,
//         email: result.user.email,
//         role: result.user.role,
//       },
//       JWT_SECRET,
//       { expiresIn: "1d" }
//     );
//     const { id, ...userWithoutId } = result.user;

//     //  console.log(result.user);
//     return sendSuccess(
//       res,
//       MESSAGES.STATUS_CODE.SUCCESS,
//       MESSAGES.LOGIN_SUCCESS,
//       userWithoutId,
//       token
//     );
//   } catch (error) {
//     // console.log(error)

//     globalErrorHandler(error, "login User!");
//   }
// };

// export const updateUser = async (
//   req: Request,
//   res: Response
// ): Promise<Response | void> => {
//   try {
//     const authUser = req.user as AuthUser;
//     if (!authUser) {
//       throw new AppError(message.UNAUTHORIZED, statusCode.UNAUTHORIZED);
//     }

//     const id = Number(req.params.userId);
//     const { user_name, email, password, age } = req.body;

//     const data = await userService.updateUserService(id, authUser, user_name, email, password, age);
//     return sendSuccess(
//       res,
//       MESSAGES.STATUS_CODE.SUCCESS,
//       oprationUpdate("User"),
//       data

//     );
//     // res.status(200).json(data);
//   } catch (error: unknown) {
//     globalErrorHandler(error, "Update User!");
//   }
// };

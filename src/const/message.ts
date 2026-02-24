import { AppError } from "../utils/errorHandler";

export const ERRORS = {
  MESSAGES: {
    UNAUTHORIZED: "Unauthorized",
    ALL_FIELDS_REQUIRED: "All fields are required",
    SERVER_ERROR: "Internal server error",
    FORBIDDEN: "Forbidden",
    ENV_MISSING: "Missing environment variable",
    SOMETHING_WENT_WRONG: "Something went wrong",
    INTERNAL_SERVER_ERROR: "Internal server error",
    INVALID: (params: string) => `${params} Invalid`,
    NOT_FOUND: (params: string) => `${params} Not Found`,
    CONFLICT: (params: string) => `${params} alredy exists`,
    REQUIRE: (params: string) => `${params} require`,
  },
  STATUS_CODE: {
    UNAUTHORIZED: 401,
    ALL_FIELDS_REQUIRED: 422,
    FORBIDDEN: 403,
    SERVER_ERROR: 500,
    NOT_FOUND: 404,
    CONFLICT: 409,
  },
};

export function globalErrorHandler(error: unknown, value: string) {
  if (error instanceof AppError) {
    throw error;
  }

  const message = `Failed to ${value}`;
  const statusCode = 400;
  throw new AppError(message, statusCode);
}

export const SUCCESSMESSAGES = {

  LOGIN_SUCCESS: "Login successful",

  SAVED: "saved successfully",
  SUCCESS: "Successfull",

  STATUS_CODE: {
    SUCCESS: 200

  }

};

export const operationDelete = (params: string): string => {
  return `${params} Deleted Successfully`;
};
export const operationCreate = (params: string): string => {
  return `${params} Create Successfully`;
};

export const oprationUpdate = (params: string):string => {

  return `${params} Update Successfully`
}

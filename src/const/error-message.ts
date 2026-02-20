import { AppError } from "../utils/errorHandler";

export const ERRORS = {
  MESSAGES: {
    UNAUTHORIZED: "Unauthorized",
    ALL_FIELDS_REQUIRED: "All fields are required",
    SERVER_ERROR: "Internal server error",
    FORBIDDEN: "Forbidden",
    ENV_MISSING: "Missing environment variable",
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

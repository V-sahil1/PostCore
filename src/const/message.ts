// src/constants/messages.ts

export const MESSAGES = {
    USER_NOT_FOUND: "User not found",
    INVALID_CREDENTIALS: "Invalid email or password",
    UNAUTHORIZED: "Unauthorized access",
    FORBIDDEN: "You are not allowed to perform this action",

    SOMETHING_WENT_WRONG: "Something went wrong",
    INTERNAL_SERVER_ERROR: "Internal server error",

    LOGIN_SUCCESS: "Login successful",
    REQUIRED: "All fields are required",

    TOKEN_NOT_DEFINE: "JWT_SECRET is not defined in .env",
    SAVED: "saved successfully",
    TOKEN_MISSING: "Token missing or invalid",
    VALIDATION_ERROR: "Validation error",
    BAD_REQUEST: "Bad Request",

    ENV_MISSING: "Missing environment variable",
    SUCCESS: "Successfull"

};

export const oprationRequired = (operation: string): string => {
    return `${operation} Required`;
};

export const operationDelete = (operation: string): string => {
    return `${operation} Deleted Successfully`;
};
export const operationCreate = (operation: string): string => {
    return `${operation} Create Successfully`;
};

export const oprationUpdate = (opration: string):string => {

    return `${opration} Update Successfully`
}
export const oprationNoteFound = (opration: string):string => {

    return`${opration} Not Found`
}

export function errorMessage(error: unknown): string { return error instanceof Error ? error.message : MESSAGES.INTERNAL_SERVER_ERROR; }
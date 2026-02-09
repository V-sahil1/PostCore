// src/constants/messages.ts

export const MESSAGES = {
    USER_NOT_FOUND: "User not found",
    INVALID_CREDENTIALS: "Invalid email or password",
    UNAUTHORIZED: "Unauthorized access",
    FORBIDDEN: "You are not allowed to perform this action",
    USER_DELETED_SUCCESSFULLY: "User deleted successfully",
    POST_DELETED_SUCCESSFULLY: "Post deleted successfully",
    COMMENT_DELETED_SUCCESSFULLY: "Comment deleted successfully",

    POST_NOT_FOUND: "Post not found",
    POST_SUCCESS: "Post created successfully",

    COMMENT_NOT_FOUND: "Comment not found",
    COMMENT_CREATE_SUCCESSFULLY: "Comment Create successfully",

    SOMETHING_WENT_WRONG: "Something went wrong",
    INTERNAL_SERVER_ERROR: "Internal server error",

    LOGIN_SUCCESS: "Login successful",
    REGISTER_SUCCESS: "User registered successfully",
    REQUIRED: "All fields are required",

    TOKEN_NOT_DEFINE: "JWT_SECRET is not defined in .env",
    SAVED: "saved successfully",
    TOKEN_MISSING: "Token missing or invalid",
    VALIDATION_ERROR: "Validation error",
    BAD_REQUEST: "Bad Request",

    ENV_MISSING: "Missing environment variable"

};

export const  oprationRequired = (opration:string)=>{

    return{
        message:`${opration} required`

    }
}
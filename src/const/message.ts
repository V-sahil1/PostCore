// src/constants/messages.ts

export const MESSAGES = {
  SOMETHING_WENT_WRONG: "Something went wrong",
  INTERNAL_SERVER_ERROR: "Internal server error",

  LOGIN_SUCCESS: "Login successful",
  REQUIRED: "All fields are required",

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

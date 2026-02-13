import { ERRORS } from "../const/error-message";
import db from "../database/models";
import { AppError } from "../utils/errorHandler";

const Token = db.token;
const message = ERRORS.message;
const statusCode = ERRORS.statusCode;

/* ================= SAVE TOKEN ================= */
export const saveTokenService = async (accessToken: string) => {
  if (!accessToken) {
    throw new AppError(message.NOT_FOUND("TOKEN"),statusCode.NOT_FOUND);
  }

  const savedToken = await Token.create({
    token_value: accessToken, // must match model field
  });

  return {
    savedToken,
  };
};

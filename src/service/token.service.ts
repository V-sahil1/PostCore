import { MESSAGES } from "../const/message";
import db from "../database/models";

const Token = db.token;

/* ================= SAVE TOKEN ================= */
export const saveTokenService = async (accessToken: string) => {
  if (!accessToken) {
    throw new Error(MESSAGES.TOKEN_MISSING);
  }

  const savedToken = await Token.create({
    token_value: accessToken, // must match model field
  });

  return {
    savedToken,
  };
};

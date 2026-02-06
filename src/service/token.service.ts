import db from "../database/models";

const Token = db.token;

/* ================= SAVE TOKEN ================= */
export const saveTokenService = async (accessToken: string) => {
  if (!accessToken) {
    throw new Error("Token missing");
  }

  const savedToken = await Token.create({
    token_value: accessToken, // must match model field
  });

  return {
    message: "Token saved successfully",
    savedToken,
  };
};

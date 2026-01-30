import db from "../../config/sql";
import type { Request, Response } from "express";

const Token = db.token;

export const saveToken = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const authHeader = req.headers.authorization;


    if (!authHeader) {
      return res.status(401).json({ message: "Token missing" });
    }

    const accessToken = authHeader.split(" ")[1];
    

    const savedToken = await Token.create({
      TokenValue: accessToken,
     
       // MUST match model field
    });
    

    return res.status(201).json({
      message: "Token saved successfully",
      savedToken,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal Server Error";
    return res.status(500).json({
      message,
    });
  }
};

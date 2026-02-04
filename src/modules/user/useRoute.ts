import bcrypt from "bcrypt";
import db from "../../config/sql";
import { config } from "dotenv";
import jwt from "jsonwebtoken";
import type { Request, Response } from "express";

config();

/* ✅ Sequelize model (correct reference) */
const User = db.user;

const JWT_SECRET = process.env.JWT_SECRET;
/* 🔐 JWT secret check */
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in .env file");
}

// const JWT_EXPIRE = process.env.JWT_EXPIRE

/* ================= REGISTER ================= */
export const register = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { user_name, email, password, role,age } = req.body;

    if (!user_name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const hash = await bcrypt.hash(password, 10);

    const user = await User.create({
      user_name,
      email,
      password: hash,
      role,
      age
    });
    const createdUser = user as unknown as { id: number; user_name:string; email: string; role: string; age:string };

     const token = jwt.sign(
      { id: createdUser.id, user_name: createdUser.user_name, email: createdUser.email, role: createdUser.role,age:createdUser.age },
      JWT_SECRET,
      { expiresIn:'1d'}
    );

    return res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        id: createdUser.id,
        user_name: createdUser.user_name,
        email: createdUser.email,
        role: createdUser.role,
        age:createdUser.age,
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Bad Request";
    console.error(message);
    return res.status(400).json({ message });
  }
};

/* ================= LOGIN ================= */
export const login = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    /* ✅ FIXED LINE */
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    const foundUser = user as unknown as { id: number; email: string; role: string; password: string };

    const isMatch = await bcrypt.compare(password, foundUser.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    

    const token = jwt.sign(
      { id: foundUser.id, email: foundUser.email, role: foundUser.role },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    return res.json({
      message: "Login successful",
      token,
      user: {
        id: foundUser.id,
        email: foundUser.email,
        role: foundUser.role,
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal Server Error";
    console.error(message);
    return res.status(500).json({ message });
  }
};

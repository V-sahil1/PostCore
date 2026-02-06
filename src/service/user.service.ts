import db from "../database/models";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { config } from "dotenv";

config();

const User = db.user;
const Post = db.post;
const Comment = db.comment;

type AuthUser = {
  id: number;
  role?: string;
  email?: string;
};

type IdRow = { id: number };

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in .env");
};

/* ================= DELETE USER ================= */
export const deleteUserService = async (
  targetUserId: number,
  authUser: AuthUser
) => {
  if (!authUser) {
    throw new Error("Unauthorized");
  }

  const user = await User.findByPk(targetUserId);
  if (!user) {
    throw new Error("User not found");
  }

  if (authUser.id !== targetUserId && authUser.role !== "admin") {
    throw new Error("You are not allowed to delete this user");
  }

  /* delete comments */
  const comments = await Comment.findAll({
    where: { user_id: targetUserId },
  });

  const commentIds = comments.map(
    (item:number) => (item as unknown as IdRow).id
  );

  if (commentIds.length > 0) {
    await Comment.destroy({ where: { id: commentIds } });
  }

  /* delete posts */
  const posts = await Post.findAll({
    where: { user_id: targetUserId },
  });

  const postIds = posts.map(
    (item:number) => (item as unknown as IdRow).id
  );

  if (postIds.length > 0) {
    await Post.destroy({ where: { id: postIds } });
  }

  await User.destroy({ where: { id: targetUserId } });

  return { message: "User deleted successfully" };
};

/* ================= REGISTER ================= */
export const registerUserService = async (data: {
  user_name: string;
  email: string;
  password: string;
  role?: string;
  age?: number;
}) => {
  const { user_name, email, password, role, age } = data;

  if (!user_name || !email || !password) {
    throw new Error("All fields are required");
  }

  const hash = await bcrypt.hash(password, 10);

  const user = await User.create({
    user_name,
    email,
    password: hash,
    role,
    age,
  });

  const createdUser = user as unknown as {
    id: number;
    user_name: string;
    email: string;
    role: string;
    age: number;
  };

  const token = jwt.sign(
    {
      id: createdUser.id,
      user_name: createdUser.user_name,
      email: createdUser.email,
      role: createdUser.role,
      age: createdUser.age,
    },
    JWT_SECRET,
    { expiresIn: "1d" }
  );

  return {
    message: "User registered successfully",
    token,
    user: {
      id: createdUser.id,
      user_name: createdUser.user_name,
      email: createdUser.email,
      role: createdUser.role,
      age: createdUser.age,
    },
  };
  
};

/* ================= LOGIN ================= */
export const loginUserService = async (email: string, password: string) => {
  if (!email || !password) {
    throw new Error("Email and password required");
  }

  const user = await User.findOne({ where: { email } });
  if (!user) {
    throw new Error("Invalid email or password");
  }

  const foundUser = user as unknown as {
    id: number;
    email: string;
    role: string;
    password: string;
  };

  const isMatch = await bcrypt.compare(password, foundUser.password);
  if (!isMatch) {
    throw new Error("Invalid email or password");
  }

  const token = jwt.sign(
    { id: foundUser.id, email: foundUser.email, role: foundUser.role },
    JWT_SECRET,
    { expiresIn: "1d" }
  );

  return {
    message: "Login successful",
    token,
    user: {
      id: foundUser.id,
      email: foundUser.email,
      role: foundUser.role,
    },
  };
};

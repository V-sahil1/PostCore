import bcrypt from "bcrypt";
import db from "../../config/sql";

import type { Request,Response } from "express";
const User = db.user;
export const register = async(req:Request,res:Response):Promise<Response> => {
  const { Username, email, password, role } = req.body;

  const hash = await bcrypt.hash(password, 10);

  const user = await User.create({
    Username,
    email,
    password: hash,
    role,
  });

 return res.json(user);
};



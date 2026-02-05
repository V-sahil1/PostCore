// import bcrypt from "bcrypt";
// import db from "../../models/index";

// import type { Request,Response } from "express";
// const User = db.user;
// export const register = async(req:Request,res:Response):Promise<Response> => {
//   const { user_name, email, password, role } = req.body;

//   const hash = await bcrypt.hash(password, 10);

//   const user = await User.create({
//     user_name,
//     email,
//     password: hash,
//     role,
//   });

//  return res.json(user);
// };



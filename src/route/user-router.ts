import { Router } from "express";
import validate from "../middleware/validateSchema";
import { login, register, deleteUser } from "../controller/user.controller";
import passport from "passport";
import { authenticateJWT } from "../middleware/jwt";
// import {  } from "../../controller/route";

import { createSchema, loginSchema } from "../validator/joi";

const router = Router();


router.post("/register",
    validate(createSchema) ,register);
router.post(
    "/login",
    passport.authenticate("local"), validate(loginSchema),login
);
router.delete('/deleteUser/:userId', authenticateJWT, deleteUser)

export default router;

import { Router } from "express";
import validate from "../../middleware/validateSchema";

import { login, register } from "./useRoute";
import passport from "passport";
import { authenticateJWT } from "../../middleware/jwt";
import { userDelete } from "../../controller/route";
import { createSchema, loginSchema } from "../../joi/joi";

const router = Router();


router.post("/register",validate(createSchema) ,register);

router.post(
    "/login",
    passport.authenticate("local"), validate(loginSchema),login
);

router.delete('/deleteUser/:userId', authenticateJWT, userDelete)


export default router;

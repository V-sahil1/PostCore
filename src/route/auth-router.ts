import { Router } from "express";
import { saveToken } from "../controller/token.controller";
import validate from "../middleware/validateSchema";
import { createSchema, loginSchema } from "../validator/joi";
import { login, register } from "../controller/user.controller";
import passport from "passport";

const router = Router();

router.post('/token', saveToken)

router.post("/register",
    validate(createSchema), register);
router.post(
    "/login",
    passport.authenticate("local"), validate(loginSchema), login

);

export default router
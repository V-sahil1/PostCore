import { Router } from "express";
import { saveToken } from "../controller/token.controller";
import validate from "../middleware/validateSchema";
import { createSchema, loginSchema } from "../validator/joi";

import { authenticateLocal } from "../middleware/login-auth";
import { login, register } from "../controller/auth.controller";

const router = Router();

router.post('/token', saveToken)

router.post("/register",
  validate(createSchema), register);
router.post(
  "/login",
  authenticateLocal, validate(loginSchema), login

);

export default router

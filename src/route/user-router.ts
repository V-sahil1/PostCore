import { Router } from "express";

import { deleteUser, getUser, updateUser } from "../controller/user.controller";

import { authenticateJWT } from "../middleware/jwt";
import { createSchema } from "../validator/joi";
import validate from "../middleware/validateSchema";
// import {  } from "../../controller/route";

const router = Router();

router.get(
    "/get-user", getUser
);
router.delete('/delete-user/:userId', authenticateJWT, deleteUser);

router.patch('/update-user/:userId', authenticateJWT, validate(createSchema),updateUser)

export default router;

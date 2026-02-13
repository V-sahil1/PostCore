import { Router } from "express";

import { deleteUser, getUser, updateUser } from "../controller/user.controller";

import { authenticateJWT } from "../middleware/jwt";
import { createSchema } from "../validator/joi";
import validate from "../middleware/validateSchema";
import { getPaginatedUsers } from "../service/user.service";
// import {  } from "../../controller/route";

const router = Router();

router.get(
    "/user/:userId",authenticateJWT, getUser
);
router.get(
    "/paginated",authenticateJWT, getPaginatedUsers
);
router.delete('/user/:userId', authenticateJWT, deleteUser);

router.patch('/user/:userId', authenticateJWT, validate(createSchema),updateUser)

export default router;

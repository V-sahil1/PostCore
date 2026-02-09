import { Router } from "express";

import { deleteUser, getUser, updateUser } from "../controller/user.controller";

import { authenticateJWT } from "../middleware/jwt";
// import {  } from "../../controller/route";

const router = Router();

router.get(
    "/get-user", getUser
);
router.delete('/delete-user/:userId', authenticateJWT, deleteUser);

router.patch('/update-user/:userId', authenticateJWT, updateUser)

export default router;

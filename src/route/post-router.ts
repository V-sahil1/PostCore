import { Router } from "express";
import { creatpost, getpost, getpostById, postDelete, updatePost } from "../controller/post.controller";
import { authenticateJWT } from "../middleware/jwt";
import { createpostSchema } from "../validator/joi";
import validate from "../middleware/validateSchema";

const router = Router();

router.get('/get', getpost)

router.post('/post', authenticateJWT, validate(createpostSchema), creatpost);
//-------------------------------------------------------------------get post
router.get('/get-post/:pid', getpostById)

router.patch('/update-post/:upId', authenticateJWT, updatePost)

router.delete('/delete-post/:delId', authenticateJWT, postDelete)

export default router;
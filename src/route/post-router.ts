import { Router } from "express";
import { creatpost, getpost, getpostById, postDelete, updatePost } from "../controller/post.controller";
import { authenticateJWT } from "../middleware/jwt";
import { createpostSchema } from "../validator/joi";
import validate from "../middleware/validateSchema";

const router = Router();

router.get('/get', getpost)

router.post('/post', authenticateJWT, validate(createpostSchema), creatpost);
//-------------------------------------------------------------------get post
router.get('/post/:postId', getpostById)

router.patch('/post/:postId', authenticateJWT, updatePost)

router.delete('/post/:postId', authenticateJWT, postDelete)

export default router;
import { Router } from "express";
import { creatPost, postDelete, updatePost, pagginationPost, getPostById } from "../controller/post.controller";
import { authenticateJWT } from "../middleware/jwt";
import { createpostSchema } from "../validator/joi";
import validate from "../middleware/validateSchema";
// import { getPaginatedPost } from "../service/post.service";

const router = Router();

router.get('/', pagginationPost)

router.post('/', authenticateJWT, validate(createpostSchema), creatPost);
//-------------------------------------------------------------------get post
router.get('/:postId', getPostById)

router.patch('/:postId', authenticateJWT, updatePost)

router.delete('/:postId', authenticateJWT, postDelete)

export default router;

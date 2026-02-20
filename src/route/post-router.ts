import { Router } from "express";
import { creatpost, getpostById, postDelete, postpaggination, updatePost } from "../controller/post.controller";
import { authenticateJWT } from "../middleware/jwt";
import { createpostSchema } from "../validator/joi";
import validate from "../middleware/validateSchema";
// import { getPaginatedPost } from "../service/post.service";

const router = Router();

router.get('/', postpaggination)

router.post('/', authenticateJWT, validate(createpostSchema), creatpost);
//-------------------------------------------------------------------get post
router.get('/:postId', getpostById)

router.patch('/:postId', authenticateJWT, updatePost)

router.delete('/:postId', authenticateJWT, postDelete)

export default router;

import { Router } from "express";
import { commentSchema, commentUpadateSchema } from "../validator/joi";
import validate from "../middleware/validateSchema";
import { createComment, deleteComment, getCommentsByPost, updateComment } from "../controller/comment.controller";
import { authenticateJWT, optionalJWT } from "../middleware/jwt";

const router = Router();

router.post('/:postId', optionalJWT, validate(commentSchema), createComment)

router.get('/:postId', getCommentsByPost)

router.patch('/:commentId', authenticateJWT, validate(commentUpadateSchema), updateComment)

router.delete('/:commentId', authenticateJWT, deleteComment)

export default router

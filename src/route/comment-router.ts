import { Router } from "express";
import { optionalJWT } from "../middleware/optinal";
import { commentSchema, commentUpadateSchema } from "../validator/joi";
import validate from "../middleware/validateSchema";
import { comment, deleteComment, getCommentsByPost, updateComment } from "../controller/comment.controller";
import { authenticateJWT } from "../middleware/jwt";

const router = Router();

router.post('/:postId', optionalJWT, validate(commentSchema), comment)

router.get('/:postId', getCommentsByPost)

router.patch('/:commentId', authenticateJWT, validate(commentUpadateSchema), updateComment)

router.delete('/:commentId', authenticateJWT, deleteComment)

export default router

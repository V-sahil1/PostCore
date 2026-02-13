import { Router } from "express";
import { optionalJWT } from "../middleware/optinal";
import { commentSchema, commentUpadateSchema} from "../validator/joi";
import validate from "../middleware/validateSchema";
import { comment, deleteComment, getcomment, updateComment } from "../controller/comment.controller";
import { authenticateJWT } from "../middleware/jwt";

const router = Router();

router.post('/comment/:postId', optionalJWT, validate(commentSchema), comment)

router.get('/all-comment', getcomment)

router.patch('/:commentId', authenticateJWT, validate(commentUpadateSchema), updateComment)

router.delete('/comment/:commentId', authenticateJWT, deleteComment)

export default router
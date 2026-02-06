import { Router } from "express";
import { optionalJWT } from "../middleware/optinal";
import { commentSchema, commentUpadateSchema, deleteComment } from "../validator/joi";
import validate from "../middleware/validateSchema";
import { comment,deletecomment, getcomment, UpdateComment } from "../controller/comment.controller";
import { authenticateJWT } from "../middleware/jwt";


const router = Router();

router.post('/comment/:postId', optionalJWT ,validate(commentSchema), comment)


router.get('/getcomment', getcomment)

router.patch('/updateComment/:commentId', authenticateJWT,validate(commentUpadateSchema), UpdateComment)

router.delete('/delete/:delId', authenticateJWT,validate(deleteComment), deletecomment)


export default router
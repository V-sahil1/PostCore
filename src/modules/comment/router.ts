import { Router } from "express";
import { optionalJWT } from "../../middleware/optinal";
import { commentSchema, commentUpadateSchema } from "../../joi/joi";
import validate from "../../middleware/validateSchema";
import { comment } from "./commentRoute";
import { deletecomment, getcomment, UpdateComment } from "../../controller/route";
import { authenticateJWT } from "../../middleware/jwt";


const router = Router();

router.post('/comment/:postId', optionalJWT ,validate(commentSchema), comment)


router.get('/getcomment', getcomment)

router.patch('/updateComment/:commentId', authenticateJWT,validate(commentUpadateSchema), UpdateComment)

router.delete('/delete/:delId', authenticateJWT, deletecomment)


export default router
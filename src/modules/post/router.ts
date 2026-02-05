import { Router } from "express";
import { getpost, getpostById, postDelete, updatePost } from "../../controller/route";
import { authenticateJWT } from "../../middleware/jwt";
import { creatpost } from "./postRoute";
import { createpostSchema } from "../../joi/joi";
import validate from "../../middleware/validateSchema";

const router = Router();


router.get('/getpostAll', getpost)

router.post('/createpost', authenticateJWT,validate(createpostSchema), creatpost);
//-------------------------------------------------------------------get post
router.get('/getpost/:pid', getpostById)

router.patch('/updatepost/:upId', authenticateJWT, updatePost)

router.delete('/deletePost/:delId', authenticateJWT, postDelete)

export default router;
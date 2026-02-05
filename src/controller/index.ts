// import { Router } from "express";
// import passport from "passport";
// import { login, register } from "../modules/user/useRoute";
// import { authenticateJWT } from "../middleware/jwt";
// import { optionalJWT } from "../middleware/optinal";
// import { comment } from "../modules/comment/commentRoute";
// import { saveToken } from "../modules/auth/tokenRoute";
// import { deletecomment, getcomment, getpost, getpostById, postDelete, UpdateComment, updatePost, userDelete } from "./route";
// import validate from "../middleware/validateSchema";
// import { creatpost } from "../modules/post/postRoute";
// import { commentSchema, commentUpadateSchema, createpostSchema, createSchema, loginSchema } from "../joi/joi";


// const router = Router();

///==============================================================> Routes <=======================================================

// ----------------------------------------------------------------user route
// router.post("/register",validate(createSchema) ,register);



//------------------------------------------------------------ router.post("/post", post);
// router.post(
//     "/login",
//     passport.authenticate("local"), validate(loginSchema),login
// );

//---------------------------------------------------------------------post route
// router.post('/createpost', authenticateJWT,validate(createpostSchema), creatpost);


//--------------------------------------------------------------------comment route
// router.post('/comment/:postId', optionalJWT ,validate(commentSchema), comment)

// -----------------------------------------------------------------access token save
// router.post('/token', saveToken)


// -----------------------------------------------------------------get Post All post
// router.get('/getpostAll', getpost)

//-------------------------------------------------------------------get post
// router.get('/getpost/:pid', getpostById)



//------------------------------------------------------------------Get comment
// router.get('/getcomment', getcomment)




//------------------------------------------------------------------update Comment
// router.patch('/updateComment/:commentId', authenticateJWT,validate(commentUpadateSchema), UpdateComment)

//--------------------------------------------------------------------updatePost
// router.patch('/updatepost/:upId', authenticateJWT, updatePost)


//--------------------------------------------------------------------Delete Comment
// router.delete('/delete/:delId', authenticateJWT, deletecomment)

//--------------------------------------------------------------------Delete Post
// router.delete('/deletePost/:delId', authenticateJWT, postDelete)


// //-----------------------------------------------------------------------Delete user
// router.delete('/deleteUser/:userId', authenticateJWT, userDelete)

// export default router;

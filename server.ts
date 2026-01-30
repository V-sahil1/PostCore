import express from "express";
import type { Application, Request, Response } from "express";
import session from "express-session";
import connectDB from "./src/config/mongo";
import db from "./src/config/sql";
import { login, register } from "./src/modules/user/useRoute";
import passport from "./src/config/passport";
import  { creatpost } from "./src/modules/post/postRoute";
import { authenticateJWT } from "./src/middleware/jwt";
import { comment } from "./src/modules/comment/commentRoute";
import { saveToken } from "./src/modules/auth/tokenRoute";
import { deletecomment, getcomment, getpost, postDelete, UpdateComment, updatePost,userDelete,getpostById } from "./src/controller/route";
import validate from "./src/middleware/validateSchema";
import { createSchema } from "./src/joi/joi";
import { optionalJWT } from "./src/middleware/optinal";


const app: Application = express();
const PORT = 5000;

connectDB();
const _db = db;
void _db;



app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: "secret123",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

///-------------------------------------------------------------------Route-------------------------------------------------------------------------------------------

// user route
app.post("/register",validate(createSchema), register);

// app.post("/post", post);
app.post(
  "/login",
  passport.authenticate("local"),login
);

//post route
app.post('/createpost' ,authenticateJWT,creatpost);
app.get("/", (_req: Request, res: Response) => {
  res.send("Server is running");
});

//comment route
app.post('/comment/:postId',optionalJWT,comment)

// access token save
app.post('/token',saveToken)

// get Post All post
app.get('/getpostAll',getpost)

//get post
app.get('/getpost/:pid',getpostById)



//Get comment
app.get('/getcomment',getcomment   )


//update Comment
app.patch('/updateComment/:commentId',authenticateJWT,UpdateComment)

//updatePost
app.patch('/updatepost/:upId',authenticateJWT,updatePost)


//Delete Comment
app.delete('/delete/:delId',authenticateJWT,deletecomment)

//Delete Post
app.delete('/deletePost/:delId',authenticateJWT,postDelete)

//Delete user
app.delete('/deleteUser/:userId',authenticateJWT,userDelete)




app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

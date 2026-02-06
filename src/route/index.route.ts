import { Router } from "express";
import userRouer from './user-router'
import postRouer from './post-router'
import commentRouer from './comment-router'
import { saveToken } from "../controller/token.controller";



const route = Router();

route.use('/user',userRouer);
route.use('/post'
   ,postRouer);
route.use('/comment',commentRouer);
route.use('/token',saveToken);


export default route




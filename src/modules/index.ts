import { Router } from "express";
import userRouer from './user/router'
import postRouer from './post/router'
import commentRouer from './comment/router'
import tokenRouer from './auth/router'



const route = Router();

route.use('/user',userRouer);
route.use('/post',postRouer);
route.use('/comment',commentRouer);
route.use('/token',tokenRouer);


export default route




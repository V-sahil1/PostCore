import { Router } from "express";
import userRouer from './user-router'
import postRouer from './post-router'
import commentRouer from './comment-router'
// import { saveToken } from "../controller/token.controller";
import tokenRouer from './auth-router'

const route = Router();

route.use('/user'/*
    #swagger.tags = ['User']*/, userRouer);
route.use('/post'
  /*
    #swagger.tags = ['Post']*/, postRouer);
route.use('/comment'
  /*
    #swagger.tags = ['Comment']*/, commentRouer);
route.use('/token'
  /*
  #swagger.tags = ['Auth']*/
  , tokenRouer);

export default route

import { Router } from "express";

import { deleteUser, getPaginated, getUser, getUserPostsWithComments, updateUserProfile } from "../controller/user.controller";

import { authenticateJWT } from "../middleware/jwt";
import { updateSchema } from "../validator/joi";
import validate from "../middleware/validateSchema";
import { redisRateLimiter } from "../middleware/ratelimiter";

// import {  } from "../../controller/route";

const router = Router();

router.get(
  "/user-post-comment", authenticateJWT, getUserPostsWithComments
);
// getPaginated
router.get(
  "/",
  authenticateJWT, getPaginated
);

router.get(
  "/:userId", redisRateLimiter, authenticateJWT, getUser
);

router.delete('/:userId', authenticateJWT, deleteUser);

router.patch('/:userId'
  ,
  authenticateJWT,
  /*
    #swagger.tags = ['User']
    #swagger.summary = 'Update user profile'
    #swagger.parameters['authorization'] = {
      in: 'header',
      required: true,
      type: 'string',
      description: 'Bearer token'
    }
    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: 'object',
            properties: {
              user_name: {
                type: 'string',
                example: 'john_doe'
              },
              email: {
                type: 'string',
                example: 'john@example.com'
              },
              password: {
                type: 'string',
                example: 'newpassword123'
              }
            }
          }
        }
      }
    }
    #swagger.responses[200] = { description: 'User updated successfully' }
    #swagger.responses[400] = { description: 'At least one field is required' }
    #swagger.responses[401] = { description: 'Unauthorized' }
    #swagger.responses[404] = { description: 'User not found' }
    #swagger.responses[409] = { p: 'Email already in use' }
    */validate(updateSchema), updateUserProfile);

export default router;
import Joi from 'joi';


export const createSchema =  Joi.object({
    user_name:Joi.string().min(3).max(7).required(),
    email:Joi.string().email().required(),
    password:Joi.string().min(3).max(10).required(),
    role:Joi.string().required(),
    id:Joi.forbidden()
});


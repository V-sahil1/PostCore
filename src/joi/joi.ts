import Joi from 'joi';



export const createSchema =  Joi.object({
    user_name:Joi.string().min(3).max(9).required(),
    email:Joi.string().email().required(),
    password:Joi.string().min(3).max(10).required(),
    role:Joi.string().required(),
    age:Joi.number().required(),
    id:Joi.forbidden()
});


export const loginSchema = Joi.object({
    email:Joi.string().email().required(),
    password:Joi.string().min(3).max(10).required()

})

export const createpostSchema = Joi.object({
    title:Joi.string().required()
})

export const commentSchema = Joi.object({
    description:Joi.string().required()
})

export const commentUpadateSchema = Joi.object({
    description:Joi.string().required(),
    id:Joi.number().required()
})
export const updatepostSchema = Joi.object({
    title:Joi.string().required(),
    

})



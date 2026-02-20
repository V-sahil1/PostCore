import Joi from 'joi';

export const createSchema = Joi.object({
  user_name: Joi.string().min(3).max(9).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(3).max(10).required(),
  age: Joi.number().required(),
  id: Joi.forbidden()
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(3).max(10).required()

})

export const updateSchema = Joi.object({
  user_name: Joi.string().optional(),
  email: Joi.string().optional(),
  password: Joi.string().optional(),
});

export const createpostSchema = Joi.object({
  title: Joi.string().required()
})

export const commentSchema = Joi.object({
  description: Joi.string().required()
})

export const commentUpadateSchema = Joi.object({
  description: Joi.string().required()
})
export const updatepostSchema = Joi.object({
  title: Joi.string().required(),

})

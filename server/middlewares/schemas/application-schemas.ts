import Joi from 'joi'

const SignUp = Joi.object().keys({
  email: Joi.string().required(),
  firstName: Joi.string().trim().required(),
  lastName: Joi.string().trim().required(),
  password: Joi.string().trim().min(1).required(),
})

const SignIn = Joi.object().keys({
  email: Joi.string().required(),
  password: Joi.string().trim().min(1).required(),
})

const Id = Joi.object().keys({
  id: Joi.number().integer().required(),
})

export { SignUp, SignIn, Id }

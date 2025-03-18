import Joi from 'joi'
import Roles from '../../types/roles'

const Create = Joi.object().keys({
  firstName: Joi.string().trim().required(),
  lastName: Joi.string().trim().required(),
  email: Joi.string().trim().required(),
  password: Joi.string().trim().min(1).required(),
  roles: Joi.array().items(Joi.string().valid(...Roles)),
})

const Update = Joi.object().keys({
  firstName: Joi.string().trim(),
  lastName: Joi.string().trim(),
  email: Joi.string().trim(),
  password: Joi.string().trim(),
})

export { Create, Update }

import Joi from 'joi'

const Create = Joi.object().keys({
  title: Joi.string().required().messages({
    'string.base': 'Invalid type, title must be a string',
    'string.empty': 'title is not allowed to be empty',
    'any.required': 'title is required',
  }),
})

const Update = Joi.object().keys({
  title: Joi.string().required(),
})

const GetAll = Joi.object().keys({
  page: Joi.number(),
})

export { Create, Update, GetAll }

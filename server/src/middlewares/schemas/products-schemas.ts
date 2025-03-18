import Joi from 'joi'
import config from '../../config/config'

const { COLLECTIONS_MIN_SIZE, COLLECTIONS_MAX_SIZE, IMAGE_MAX_SIZE_MB } =
  config.app

const IMAGE_MAX_SIZE = 1024 * (1024 * IMAGE_MAX_SIZE_MB)

const Create = Joi.object().keys({
  title: Joi.string().trim().required().messages({
    'string.base': 'Invalid type, title must be a string',
    'string.empty': 'Title is not allowed to be empty',
    'any.required': 'Title is required',
  }),
  description: Joi.string().allow(null, ''),
  price: Joi.number().precision(2).positive().required().messages({
    'number.base': 'Invalid type, price must be a number',
    'number.precision':
      'Invalid price, the price must have only {#limit} decimal places',
    'number.positive': 'Invalid price, the price must be positive',
    'any.required': 'Price required',
  }),
  inventory: Joi.number().integer().required(),
  statusId: Joi.number().integer(),
  categoryId: Joi.number().integer(),
})

const UploadImage = Joi.object()
  .keys({
    mimetype: Joi.string().valid(...['image/png', 'image/jpeg']),
    path: Joi.string().trim().required(),
    size: Joi.number()
      .integer()
      .required()
      .max(IMAGE_MAX_SIZE)
      .messages({
        'number.max': `"size" should have a max length of ${IMAGE_MAX_SIZE_MB} MB (${IMAGE_MAX_SIZE} bytes)`,
      }),
  })
  .options({ allowUnknown: true })

const CreateCollectionItem = Joi.object().keys({
  title: Joi.string().trim().required(),
  description: Joi.string().trim(),
  price: Joi.number().precision(2).required(),
  inventory: Joi.number().integer().required(),
  image: Joi.string().trim(),
  statusId: Joi.number().integer(),
  categoryId: Joi.number().integer(),
})

const CreateCollection = Joi.object().keys({
  products: Joi.array()
    .min(COLLECTIONS_MIN_SIZE)
    .max(COLLECTIONS_MAX_SIZE)
    .items(CreateCollectionItem)
    .required()
    .unique('title'),
})

const Update = Joi.object().keys({
  title: Joi.string().trim(),
  description: Joi.string().trim(),
  price: Joi.number().precision(2),
  inventory: Joi.number().integer(),
  image: Joi.string().trim(),
  imageRemove: Joi.boolean(),
  statusId: Joi.number().integer(),
  categoryId: Joi.number().integer(),
})

const GetAll = Joi.object().keys({
  page: Joi.number(),
})

export { Create, CreateCollection, Update, GetAll, UploadImage }

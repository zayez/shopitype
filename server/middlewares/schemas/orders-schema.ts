import Joi from 'joi'

const OrderItem = Joi.object().keys({
  productId: Joi.number().integer().required(),
  quantity: Joi.number().integer().required(),
})

const ShippingAddress = Joi.object().keys({
  addressLine1: Joi.string().trim().required(),
  addressLine2: Joi.string().allow(null, ''),
  city: Joi.string().trim().required(),
  country: Joi.string().trim().required(),
  state: Joi.string().trim().required(),
  postalCode: Joi.number().integer().required(),
})

const ShippingStatus = Joi.object().keys({
  status: Joi.string()
    .valid(...['shipped', 'unshipped', 'delivered'])
    .required(),
})

const PlaceOrder = Joi.object().keys({
  items: Joi.array().items(OrderItem).required(),
  dateOrder: Joi.date(),
  paymentStatus: Joi.string()
    .valid(...['paid', 'unpaid'])
    .required(),
  shippingAddress: ShippingAddress.required(),
})

const GetAllByUser = Joi.object().keys({
  userId: Joi.number().integer().required(),
})

const GetOneByUser = Joi.object().keys({
  userId: Joi.number().integer().required(),
  orderId: Joi.number().integer().required(),
})

const GetAll = Joi.object().keys({
  page: Joi.number(),
})

export { PlaceOrder, GetAllByUser, GetOneByUser, GetAll, ShippingStatus }

import compose from 'koa-compose'
import { authorizeCustomer, authorizeManagers } from '../authorization'
import {
  validateAuthorization,
  validateGetAll,
  validateGetAllByUser,
  validateGetOneByUser,
  validateItems,
  validateOrder,
  validateShippingStatus,
} from './ordersValidation'
import OrdersMiddleware from './ordersMiddleware'
import { isValidId } from '../application/applicationValidation'

const placeOrder = compose([
  authorizeCustomer,
  validateOrder,
  validateItems,
  OrdersMiddleware.placeOrder,
])

const getAllByUser = compose([
  authorizeCustomer,
  validateAuthorization,
  validateGetAllByUser,
  OrdersMiddleware.getAllByUser,
])

const getOneByUser = compose([
  authorizeCustomer,
  validateAuthorization,
  validateGetOneByUser,
  OrdersMiddleware.getOneByUser,
])

const getAll = compose([
  authorizeManagers,
  validateGetAll,
  OrdersMiddleware.getAll,
])

const get = compose([authorizeManagers, isValidId, OrdersMiddleware.get])

const markShippingStatus = compose([
  authorizeManagers,
  validateShippingStatus,
  OrdersMiddleware.markShippingStatus,
])

const OrdersPipeline = {
  placeOrder,
  getAllByUser,
  getOneByUser,
  getAll,
  get,
  markShippingStatus,
}

export default OrdersPipeline

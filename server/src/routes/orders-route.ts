import Router from 'koa-router'
import {
  GET_ORDER,
  GET_ORDERS,
  GET_USER_ORDER,
  GET_USER_ORDERS,
  PATCH_ORDER_MARK_SHIPPING_STATUS,
  POST_ORDER,
} from '../api/endpoint-urls'
import compose from 'koa-compose'
import {
  authorizeCustomer,
  authorizeManagers,
} from '../middlewares/authorization'
import {
  validateAuthorization,
  validateGetAll,
  validateGetAllByUser,
  validateGetOneByUser,
  validateItems,
  validateOrder,
  validateShippingStatus,
} from '../middlewares/validations/orders-validation'
import OrdersMiddleware from '../middlewares/domains/orders-middleware'
import { isValidId } from '../middlewares/validations/application-validation'

const router = new Router()

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

router.post(POST_ORDER, placeOrder)
router.get(GET_USER_ORDERS, getAllByUser)
router.get(GET_USER_ORDER, getOneByUser)
router.get(GET_ORDER, get)
router.get(GET_ORDERS, getAll)
router.patch(PATCH_ORDER_MARK_SHIPPING_STATUS, markShippingStatus)

export default router

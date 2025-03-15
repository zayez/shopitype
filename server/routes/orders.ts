import Router from 'koa-router'
import {
  GET_ORDER,
  GET_ORDERS,
  GET_USER_ORDER,
  GET_USER_ORDERS,
  PATCH_ORDER_MARK_SHIPPING_STATUS,
  POST_ORDER,
} from '../api/endpointUrls'
import OrdersPipeline from '../middlewares/orders'

const router = new Router()

router.post(POST_ORDER, OrdersPipeline.placeOrder)
router.get(GET_USER_ORDERS, OrdersPipeline.getAllByUser)
router.get(GET_USER_ORDER, OrdersPipeline.getOneByUser)
router.get(GET_ORDER, OrdersPipeline.get)
router.get(GET_ORDERS, OrdersPipeline.getAll)
router.patch(
  PATCH_ORDER_MARK_SHIPPING_STATUS,
  OrdersPipeline.markShippingStatus,
)

export default router

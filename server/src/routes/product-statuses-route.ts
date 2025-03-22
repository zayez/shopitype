import Router from 'koa-router'
import { GET_PRODUCT_STATUSES } from '../api/endpoint-urls'
import compose from 'koa-compose'
import ProductStatusesMiddleware from '../middlewares/domains/product-statuses-middleware'
import Koa from 'koa'

const router = new Router<Koa.DefaultState, Koa.DefaultContext>()

const getAll = compose([ProductStatusesMiddleware.getAll])

router.get(GET_PRODUCT_STATUSES, getAll)

export default router

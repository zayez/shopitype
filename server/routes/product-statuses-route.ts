import Router from 'koa-router'
import { GET_PRODUCT_STATUSES } from '../api/endpoint-urls'
import compose from 'koa-compose'
import ProductStatusesMiddleware from '../middlewares/domains/product-statuses-middleware'

const router = new Router()

const getAll = compose([ProductStatusesMiddleware.getAll])

router.get(GET_PRODUCT_STATUSES, getAll)

export default router

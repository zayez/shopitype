import Router from 'koa-router'
import { GET_PRODUCT_STATUSES } from '../api/endpointUrls'
import ProductStatusesPipeline from '../middlewares/productStatuses'

const router = new Router()
router.get(GET_PRODUCT_STATUSES, ProductStatusesPipeline.getAll)

export default router

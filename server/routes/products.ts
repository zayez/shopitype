import Router from 'koa-router'
import {
  DELETE_PRODUCT,
  GET_PRODUCT,
  GET_PRODUCTS,
  PATCH_PRODUCT,
  POST_PRODUCT,
  POST_PRODUCT_COLLECTION,
} from '../api/endpointUrls'
import ProductsPipeline from '../middlewares/products'
const router = new Router()

router.post(POST_PRODUCT, ProductsPipeline.create)
router.post(POST_PRODUCT_COLLECTION, ProductsPipeline.createCollection)
router.patch(PATCH_PRODUCT, ProductsPipeline.update)
router.delete(DELETE_PRODUCT, ProductsPipeline.destroy)
router.get(GET_PRODUCT, ProductsPipeline.get)
router.get(GET_PRODUCTS, ProductsPipeline.getAll)

export default router

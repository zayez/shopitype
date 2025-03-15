import Router from 'koa-router'
import CategoriesPipeline from '../middlewares/categories'
import {
  DELETE_CATEGORY,
  GET_CATEGORIES,
  GET_CATEGORY,
  PATCH_CATEGORY,
  POST_CATEGORY,
} from '../api/endpointUrls'
const router = new Router()

router.post(POST_CATEGORY, CategoriesPipeline.create)
router.patch(PATCH_CATEGORY, CategoriesPipeline.update)
router.delete(DELETE_CATEGORY, CategoriesPipeline.destroy)
router.get(GET_CATEGORY, CategoriesPipeline.get)
router.get(GET_CATEGORIES, CategoriesPipeline.getAll)

export default router

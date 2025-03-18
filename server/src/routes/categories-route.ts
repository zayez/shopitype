import Router from 'koa-router'
import {
  DELETE_CATEGORY,
  GET_CATEGORIES,
  GET_CATEGORY,
  PATCH_CATEGORY,
  POST_CATEGORY,
} from '../api/endpoint-urls'
import compose from 'koa-compose'
import { authorizeAdmin } from '../middlewares/authorization'
import {
  disallowDuplicate,
  entityExists,
} from '../middlewares/resource-checks-middleware'
import CategoriesMiddleware from '../middlewares/domains/categories-middleware'
import {
  isValidCreate,
  isValidGetAll,
  isValidUpdate,
} from '../middlewares/validations/categories-validations'
import { isValidId } from '../middlewares/validations/application-validation'
const router = new Router()

const create = compose([
  authorizeAdmin,
  isValidCreate,
  disallowDuplicate('category', 'title'),
  CategoriesMiddleware.create,
])

const update = compose([
  authorizeAdmin,
  isValidUpdate,
  entityExists('category'),
  CategoriesMiddleware.update,
])

const destroy = compose([
  authorizeAdmin,
  isValidId,
  CategoriesMiddleware.destroy,
])
const get = compose([authorizeAdmin, isValidId, CategoriesMiddleware.get])

const getAll = compose([
  authorizeAdmin,
  isValidGetAll,
  CategoriesMiddleware.getAll,
])

router.post(POST_CATEGORY, create)
router.patch(PATCH_CATEGORY, update)
router.delete(DELETE_CATEGORY, destroy)
router.get(GET_CATEGORY, get)
router.get(GET_CATEGORIES, getAll)

export default router

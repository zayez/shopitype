import Router from 'koa-router'
import {
  DELETE_PRODUCT,
  GET_PRODUCT,
  GET_PRODUCTS,
  PATCH_PRODUCT,
  POST_PRODUCT,
  POST_PRODUCT_COLLECTION,
} from '../api/endpoint-urls'
import compose from 'koa-compose'
import { authorizeAdmin, authorizeManagers } from '../middlewares/authorization'
import upload from '../helpers/upload-helper'
import {
  validateCreate,
  validateCreateCollection,
  validateGetAll,
  validateUpdate,
  validateUpload,
} from '../middlewares/validations/products-validation'
import ProductsMiddleware from '../middlewares/domains/products-middleware'
import { isValidId } from '../middlewares/validations/application-validation'
import { disallowDuplicates } from '../middlewares/resource-checks-middleware'
import Koa from 'koa'

const router = new Router<Koa.DefaultState, Koa.DefaultContext>()

const create = compose([
  authorizeManagers,
  upload.single('image'),
  validateUpload,
  validateCreate,
  ProductsMiddleware.create,
])

const update = compose([
  authorizeManagers,
  upload.single('image'),
  validateUpload,
  validateUpdate,
  ProductsMiddleware.update,
])

const createCollection = compose([
  authorizeAdmin,
  validateCreateCollection,
  disallowDuplicates('product', 'title'),
  ProductsMiddleware.createCollection,
])

const destroy = compose([
  authorizeManagers,
  isValidId,
  ProductsMiddleware.destroy,
])

const get = compose([isValidId, ProductsMiddleware.get])
const getAll = compose([validateGetAll, ProductsMiddleware.getAll])

router.post(POST_PRODUCT, create)
router.post(POST_PRODUCT_COLLECTION, createCollection)
router.patch(PATCH_PRODUCT, update)
router.delete(DELETE_PRODUCT, destroy)
router.get(GET_PRODUCT, get)
router.get(GET_PRODUCTS, getAll)

export default router

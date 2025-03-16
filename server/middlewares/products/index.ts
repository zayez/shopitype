import compose from 'koa-compose'
import upload from '../../helpers/uploadHelper'
import {
  validateCreate,
  validateUpdate,
  validateCreateCollection,
  validateGetAll,
  validateUpload,
} from './productsValidation'
import { authorizeAdmin, authorizeManagers } from '../authorization'
import ProductsMiddleware from './productsMiddleware'
import { disallowDuplicates } from '../verify'
import { isValidId } from '../application/applicationValidation'

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

const ProductsPipeline = {
  create,
  createCollection,
  update,
  destroy,
  get,
  getAll,
}

export default ProductsPipeline

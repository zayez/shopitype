import compose from 'koa-compose'

import {
  isValidCreate,
  isValidUpdate,
  isValidGetAll,
} from './categoriesValidations'
import { authorizeAdmin } from '../authorization'
import { disallowDuplicate, entityExists } from '../verify'
import CategoriesMiddleware from './categoriesMiddleware'
import { isValidId } from '../application/applicationValidation'

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

const CategoriesPipeline = { create, update, destroy, get, getAll }

export default CategoriesPipeline

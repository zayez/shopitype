import queryBuilder from '../lib/queryBuilder'
import { Model } from './model'

const TABLE_NAME = 'categories'
const SELECTABLE_FIELDS = ['id', 'title', 'updatedAt', 'createdAt']

export interface CategoryModel {
  id?: number
  title?: string
  createdAt?: any
  updatedAt?: any
}

const {
  find,
  findAll,
  findOne,
  findById,
  create,
  update,
  destroy,
  destroyAll,
  includesAny,
} = queryBuilder(TABLE_NAME, SELECTABLE_FIELDS)

const tableName = TABLE_NAME
const fields = SELECTABLE_FIELDS

const Category: Model<CategoryModel> = {
  tableName,
  fields,
  find,
  findAll,
  findOne,
  findById,
  create,
  update,
  destroy,
  destroyAll,
  includesAny,
}

export default Category

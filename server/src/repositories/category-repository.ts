import queryBuilder from '../lib/query-builder/query-builder'
import { Category } from '../models/category'
import { Repository } from './repository'

const TABLE_NAME = 'categories'
const SELECTABLE_FIELDS = ['id', 'title', 'updatedAt', 'createdAt']

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

const CategoryRepository: Repository<Category> = {
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

export default CategoryRepository

import knex from '../db'
import queryBuilder from '../lib/queryBuilder'
import { PROD_ACTIVE } from '../types/ProductStatus'
import { Model } from './model'

const TABLE_NAME = 'products'
const SELECTABLE_FIELDS = [
  'id',
  'title',
  'description',
  'price',
  'inventory',
  'image',
  'statusId',
  'categoryId',
  'updatedAt',
  'createdAt',
]

export interface ProductModel {
  id?: number
  title?: string
  description?: string
  image?: string
  price?: number
  inventory?: number
  statusId?: number
  categoryId?: number
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
const ProductStatus = queryBuilder('productStatus')

const findAllActive = async (pagination) => {
  const activeStatus = await ProductStatus.findOne({ name: PROD_ACTIVE })
  const products = await find({ statusId: activeStatus.id }, pagination)
  return products
}

const findAllIn = async (ids) => {
  const items = await knex(TABLE_NAME).select('*').whereIn('id', ids)
  return items
}

const findOneActive = async (id) => {
  const statusId = (await ProductStatus.findOne({ name: PROD_ACTIVE })).id
  return await findOne({ id, statusId })
}

const includesAll = async (field, values: any[]) => {
  if (!values?.length) return false
  const products = await knex(TABLE_NAME).select('id').whereIn(field, values)
  return products.length === values.length
}

const hasInventory = async (items) => {
  for (const item of items) {
    const product = await knex(TABLE_NAME)
      .select('inventory')
      .where('id', item.productId)
      .first()
    if (product.inventory < item.quantity) return false
  }
  return true
}

const Product: Model<ProductModel> = {
  tableName: TABLE_NAME,
  fields: SELECTABLE_FIELDS,
  find,
  findAll,
  findOne,
  findById,
  create,
  update,
  destroy,
  destroyAll,
  includesAny,
  findAllActive,
  findAllIn,
  findOneActive,
  includesAll,
  hasInventory,
}

export default Product

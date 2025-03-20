import knex from '../db/db'
import { Repository } from '../repositories/repository'
import { Product } from '../models/product'
import { PROD_ACTIVE } from '../types/product-status'
import queryBuilder from '../lib/query-builder/query-builder'
import { UserCreateParams } from './user-repository'
import { OrderItem } from '../models/order'

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

const findAllActive = async (page?: number) => {
  const activeStatus = await ProductStatus.findOne({ name: PROD_ACTIVE })
  const products = await find({ statusId: activeStatus.id }, { page })
  return products
}

const findAllIn = async (ids: number[]) => {
  const items = await knex(TABLE_NAME).select('*').whereIn('id', ids)
  return items as Product[]
}

const findOneActive = async (id: number) => {
  const statusId = (await ProductStatus.findOne({ name: PROD_ACTIVE })).id
  return await findOne({ id, statusId })
}

const includesAll = async (field: string, values: any[]) => {
  if (!values?.length) return false
  const products = await knex(TABLE_NAME).select('id').whereIn(field, values)
  return products.length === values.length
}

const hasInventory = async (items: OrderItem[]) => {
  for (const item of items) {
    if (!item.quantity) {
      return false
    }
    const product = await knex(TABLE_NAME)
      .select('inventory')
      .where('id', item.productId)
      .first()
    if (product.inventory < item.quantity) return false
  }
  return true
}

interface ProductRepositoryBase
  extends Repository<Product, Product | Product[]> {
  findAllActive: (page?: number) => Promise<Product[]>
  findAllIn: (ids: number[]) => Promise<Product[]>
  findOneActive: (id: number) => Promise<Product | null>
  includesAll: (field: string, values: any) => Promise<boolean>
  hasInventory: (items: OrderItem[]) => Promise<boolean>
}

const ProductRepository: ProductRepositoryBase = {
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

export default ProductRepository

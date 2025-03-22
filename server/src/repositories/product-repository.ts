import knex from '../db/db'
import { Repository } from '../repositories/repository'
import { Product } from '../models/product'
import { PROD_ACTIVE } from '../types/product-status'
import queryBuilder from '../lib/query-builder/query-builder'
import { OrderItem } from '../models/order'
import { ProductStatus } from '../models/product-status'

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
} = queryBuilder<Partial<Product>>(TABLE_NAME, SELECTABLE_FIELDS)
const ProductStatus = queryBuilder<Partial<ProductStatus>>('productStatus')

const findAllActive = async (page?: number) => {
  const activeStatus = await ProductStatus.findOne({ name: PROD_ACTIVE })
  if (!activeStatus) {
    throw new Error('Did not found a product status active!')
  }
  const products = await find({ statusId: activeStatus.id }, { page })
  return products
}

const findAllIn = async (ids: number[]) => {
  const items = await knex(TABLE_NAME).select('*').whereIn('id', ids)
  return items as Product[]
}

const findOneActive = async (id: number) => {
  const activeStatus = await ProductStatus.findOne({ name: PROD_ACTIVE })
  if (!activeStatus) {
    throw new Error('Did not found a product status active!')
  }
  return await findOne({ id, statusId: activeStatus.id })
}

const includesAll = async (field: string, values: string[]) => {
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

interface ProductRepositoryBase extends Repository<Partial<Product>> {
  findAllActive: (page?: number) => Promise<Partial<Product>[]>
  findAllIn: (ids: number[]) => Promise<Product[]>
  findOneActive: (id: number) => Promise<Partial<Product> | null | undefined>
  includesAll: (field: string, values: string[]) => Promise<boolean>
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

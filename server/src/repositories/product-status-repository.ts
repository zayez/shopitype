import queryBuilder from '../lib/query-builder/query-builder'
import { ProductStatus } from '../models/product-status'
import { MinimalRepository } from '../repositories/repository'

const TABLE_NAME = 'productStatus'
const SELECTABLE_FIELDS = ['id', 'name', 'updatedAt', 'createdAt']

const { findById, findAll } = queryBuilder(TABLE_NAME, SELECTABLE_FIELDS)

const ProductStatusRepository: MinimalRepository<ProductStatus> = {
  findById,
  findAll,
}

export default ProductStatusRepository

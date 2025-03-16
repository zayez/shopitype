import queryBuilder from '../lib/queryBuilder'
import { MinimalModel } from './model'

const TABLE_NAME = 'productStatus'
const SELECTABLE_FIELDS = ['id', 'name', 'updatedAt', 'createdAt']

export interface ProductStatusModel {
  id?: number
  name?: string
  createdAt?: any
  updatedAt?: any
}

const { findById, findAll } = queryBuilder(TABLE_NAME, SELECTABLE_FIELDS)

const ProductStatus: MinimalModel<ProductStatusModel> = { findById, findAll }

export default ProductStatus

import { Category } from './category'
import { Product } from './product'
import { ProductStatus } from './product-status'
import { User } from './user'

export interface Entity {
  entity?: User | Category | Product | ProductStatus
}

export type ModelType = 'category' | 'product' | 'user' | 'productstatus'

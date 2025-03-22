import { Category } from './category'
import { Order } from './order'
import { Product } from './product'
import { ProductStatus } from './product-status'
import { User } from './user'

export interface Entity {
  entity?: User | Category | Product | ProductStatus | Order
}

export type ModelType = 'category' | 'product' | 'user' | 'productstatus'

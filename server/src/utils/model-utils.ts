import { MinimalRepository, Repository } from '../repositories/repository'
import { Category } from '../models/category'
import { Order } from '../models/order'
import { Product } from '../models/product'
import { ProductStatus } from '../models/product-status'
import { User } from '../models/user'
import OrderRepository, {
  OrderCreateParams,
} from '../repositories/order-repository'
import UserRepository, {
  UserCreateParams,
} from '../repositories/user-repository'
import CategoryRepository from '../repositories/category-repository'
import ProductRepository from '../repositories/product-repository'
import ProductStatusRepository from '../repositories/product-status-repository'

interface ModelMap {
  category: Repository<Category>
  order: Repository<Order, OrderCreateParams>
  product: Repository<Product>
  productstatus: MinimalRepository<ProductStatus>
  user: Repository<User, UserCreateParams>
}

const modelMap: ModelMap = {
  category: CategoryRepository,
  order: OrderRepository,
  product: ProductRepository,
  productstatus: ProductStatusRepository,
  user: UserRepository,
}

export { modelMap }

import Category, { CategoryModel } from '../models/category'
import { MinimalModel, Model } from '../models/model'
import Order, { OrderCreateParams, OrderModel } from '../models/order'
import Product, { ProductModel } from '../models/product'
import ProductStatus, { ProductStatusModel } from '../models/productStatus'
import User, { UserCreateParams, UserModel } from '../models/user'

type AllModels =
  | Model<CategoryModel>
  | Model<OrderModel>
  | Model<ProductModel>
  | Model<ProductStatusModel>
  | Model<UserModel>

interface ModelMap {
  category: Model<CategoryModel>
  order: Model<OrderModel, OrderCreateParams>
  product: Model<ProductModel>
  productstatus: MinimalModel<ProductStatusModel>
  user: Model<UserModel, UserCreateParams>
}

const modelMap: ModelMap = {
  category: Category,
  order: Order,
  product: Product,
  productstatus: ProductStatus,
  user: User,
}

export { modelMap }

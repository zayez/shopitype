import { CategoryModel } from '../models/category'
import {
  OrderItemModel,
  OrderModel,
  ShippingAddressModel,
} from '../models/order'
import { ProductModel } from '../models/product'
import { UserModel } from '../models/user'

const mapCategory = ({ title }: { title?: string }) => {
  const category: CategoryModel = {}
  if (title) category.title = title

  return category
}

const mapProduct = ({
  title,
  description,
  image,
  price,
  inventory,
  statusId,
  categoryId,
}: {
  title?: string
  description?: string
  image?: string
  price?: number
  inventory?: number
  statusId?: number
  categoryId?: number
}) => {
  const product: ProductModel = {}
  if (title) product.title = title
  if (description) product.description = description
  if (image) product.image = image
  if (price) product.price = price
  if (inventory) product.inventory = inventory
  if (statusId) product.statusId = statusId
  if (categoryId) product.categoryId = categoryId

  return product
}

const mapUser = ({
  firstName,
  lastName,
  email,
  password,
}: {
  firstName?: string
  lastName?: string
  email?: string
  password?: string
}) => {
  const user: UserModel = {}
  if (firstName) user.firstName = firstName
  if (lastName) user.lastName = lastName
  if (email) user.email = email
  if (password) user.password = password

  return user
}

const mapOrderItem = ({ productId, price, total, subtotal, quantity }) => {
  const item: OrderItemModel = {}
  item.productId = productId
  if (price) item.price = price
  if (total) item.total = total
  if (subtotal) item.subtotal = subtotal
  item.quantity = quantity
  return item
}

const mapOrder = ({
  items,
  total,
  subtotal,
  paymentStatus,
  paymentStatusId,
  shippingAddress,
  dateOrder,
}) => {
  const order: OrderModel = {}
  if (items) order.items = items.map(mapOrderItem)
  if (total) order.total = total
  if (subtotal) order.subtotal = subtotal
  if (paymentStatus) order.paymentStatus = paymentStatus
  if (paymentStatusId) order.paymentStatusId = paymentStatusId
  if (shippingAddress) order.shippingAddress = shippingAddress
  if (dateOrder) order.dateOrder = dateOrder
  return order
}

const mapShippingAddress = ({
  addressLine1,
  addressLine2,
  city,
  country,
  state,
  postalCode,
}) => {
  const addr: ShippingAddressModel = {}
  if (addressLine1) addr.addressLine1 = addressLine1
  if (addressLine2) addr.addressLine2 = addressLine2
  if (city) addr.city = city
  if (country) addr.country = country
  if (state) addr.state = state
  if (postalCode) addr.postalCode = postalCode
  return addr
}

const inputMapper = {
  mapCategory,
  mapProduct,
  mapUser,
  mapOrder,
  mapShippingAddress,
}

export default inputMapper

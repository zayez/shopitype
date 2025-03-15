import { CategoryModel } from '../models/category'
import {
  OrderItemModel,
  OrderModel,
  ShippingAddressModel,
} from '../models/order'
import { ProductModel } from '../models/product'
import { ProductStatusModel } from '../models/productStatus'
import { UserModel } from '../models/user'

const mapCategory = ({ id, title, createdAt, updatedAt }) => {
  const category: CategoryModel = {}
  if (id) category.id = id
  if (title) category.title = title
  if (createdAt) category.createdAt = createdAt
  if (updatedAt) category.updatedAt = updatedAt

  return category
}

interface mapProductProps {
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

const mapProduct = ({
  id,
  title,
  description,
  image,
  price,
  inventory,
  statusId,
  categoryId,
  createdAt,
  updatedAt,
}: mapProductProps) => {
  const product: ProductModel = {}
  if (id) product.id = id
  if (title) product.title = title
  if (description) product.description = description
  if (image) product.image = image
  if (price) product.price = price
  if (inventory) product.inventory = inventory
  if (statusId) product.statusId = statusId
  if (categoryId) product.categoryId = categoryId
  if (createdAt) product.createdAt = createdAt
  if (updatedAt) product.updatedAt = updatedAt

  return product
}

const mapProductStatus = ({ id, name, createdAt, updatedAt }) => {
  const status: ProductStatusModel = {}
  if (id) status.id = id
  if (name) status.name = name
  if (createdAt) status.createdAt = createdAt
  if (updatedAt) status.updatedAt = updatedAt

  return status
}

interface mapUserProps {
  id?: number
  firstName?: string
  lastName?: string
  email?: string
  createdAt?: any
  updatedAt?: any
  roles?: any
}

const mapUser = ({
  id,
  firstName,
  lastName,
  email,
  createdAt,
  updatedAt,
  roles,
}: mapUserProps) => {
  const user: UserModel = {}
  if (id) user.id = id
  if (firstName) user.firstName = firstName
  if (lastName) user.lastName = lastName
  if (email) user.email = email
  if (createdAt) user.createdAt = createdAt
  if (updatedAt) user.updatedAt = updatedAt
  if (roles) user.roles = roles

  return user
}

const mapOrderItem = ({
  id,
  title,
  image,
  total,
  subtotal,
  price,
  quantity,
}) => {
  const item: OrderItemModel = {}
  if (id) item.id = id
  if (title) item.title = title
  if (image) item.image = image
  if (total) item.total = total
  if (subtotal) item.subtotal = subtotal
  if (price) item.price = price
  if (quantity) item.quantity = quantity
  return item
}

const mapOrder = ({
  id,
  total,
  subtotal,
  items,
  dateOrder,
  customer,
  paymentStatus,
  shippingStatus,
  shippingAddress,
}) => {
  const order: OrderModel = {}
  if (id) order.id = id
  if (dateOrder) order.dateOrder = dateOrder
  if (total) order.total = total
  if (subtotal) order.subtotal = subtotal
  if (items) order.items = items.map(mapOrderItem)
  if (customer) order.customer = customer
  if (total) order.total = total
  if (shippingStatus) order.shippingStatus = shippingStatus
  if (paymentStatus) order.paymentStatus = paymentStatus
  if (shippingAddress)
    order.shippingAddress = mapShippingAddress(shippingAddress)

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

const outputMapper = {
  mapCategory,
  mapProduct,
  mapProductStatus,
  mapUser,
  mapOrder,
}

export default outputMapper

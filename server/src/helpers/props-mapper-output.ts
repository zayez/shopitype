import { Category } from '../models/category'
import { OrderItem, Order, ShippingAddress } from '../models/order'
import { Product } from '../models/product'
import { ProductStatus } from '../models/product-status'
import { User } from '../models/user'
import { PaymentStatusType } from '../types/payment-status'
import { ShippingStatusType } from '../types/shipping-status'

const mapCategory = ({
  id,
  title,
  createdAt,
  updatedAt,
}: {
  id?: number
  title?: string
  createdAt?: Date
  updatedAt?: Date
}) => {
  const category: Category = {}
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
  const product: Product = {}
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

const mapProductStatus = ({
  id,
  name,
  createdAt,
  updatedAt,
}: {
  id?: number
  name?: string
  createdAt?: Date
  updatedAt?: Date
}) => {
  const status: ProductStatus = {}
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
  const user: User = id ? { id } : {}
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
}: {
  id?: number
  title?: string
  image?: string
  total?: number
  subtotal?: number
  price?: number
  quantity?: number
}) => {
  const item: OrderItem = {}
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
}: {
  id?: number
  total?: number
  subtotal?: number
  items?: OrderItem[]
  dateOrder?: Date
  customer?: any
  paymentStatus?: PaymentStatusType
  shippingStatus?: ShippingStatusType
  shippingAddress?: any
}) => {
  const order: Order = {}
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
}: {
  addressLine1: string
  addressLine2: string
  city: string
  country: string
  state: string
  postalCode: any
}) => {
  const addr: ShippingAddress = {}
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

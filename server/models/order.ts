import { format } from 'date-fns'
import knex from '../db'
import { app } from '../config'
import { SHIPPING_UNSHIPPED } from '../types/ShippingStatus'
import queryBuilder from '../lib/queryBuilder'
import { Model } from './model'

const TABLE_NAME = 'orders'
const SELECTABLE_FIELDS = ['id']
const { ITEMS_PER_PAGE } = app

export interface OrderModel {
  userId?: number
  id?: number
  customer?: any
  items?: OrderItemModel
  total?: number
  subtotal?: number
  paymentStatus?: string
  paymentStatusId?: number
  shippingAddressId?: number
  shippingAddress?: any
  shippingStatus?: any
  dateOrder?: any
  createdAt?: any
  updatedAt?: any
}

export interface OrderItemModel {
  id?: number
  title?: string
  image?: string
  productId?: number
  price?: number
  total?: number
  subtotal?: number
  quantity?: number
  createdAt?: any
  updatedAt?: any
}

export interface ShippingAddressModel {
  addressLine1?: string
  addressLine2?: string
  city?: string
  country?: string
  state?: string
  postalCode?: string
  createdAt?: any
  updatedAt?: any
}

const { findOne, update, destroy, destroyAll, includesAny } = queryBuilder(
  TABLE_NAME,
  SELECTABLE_FIELDS,
)

/**
 * Creates an order based on stripe webhook that includes total and subtotal.
 * @param {order} order order to create
 * @param {int} userId order's user
 * @returns
 */
const createForStripe = async ({ order, userId }) => {
  const { dateOrder, subtotal, total, items, paymentStatus, shippingAddress } =
    order

  const paymentStatusSelected = await knex('paymentStatus')
    .select('id')
    .where('name', paymentStatus.toString())
    .first()
  const paymentStatusId = paymentStatusSelected.id

  const shippingStatus = await knex('shippingStatus')
    .select('id')
    .where('name', SHIPPING_UNSHIPPED)
    .first()

  if (!shippingStatus) return null

  const shippingStatusId = shippingStatus.id

  const addressFound = await knex('shippingAddresses')
    .select('id')
    .where(shippingAddress)
    .first()

  let shippingAddressId

  if (addressFound) {
    shippingAddressId = addressFound.id
  } else {
    shippingAddressId = await knex('shippingAddresses').insert(shippingAddress)
  }

  //TODO: Try to use the best format
  // const dateFormat = 'yyyy-MM-dd-hh-mm-ss'
  // const date = dateOrder ? dateOrder : format(new Date(), dateFormat)
  const date = dateOrder ? dateOrder : new Date()

  const newOrder = {
    subtotal,
    total,
    dateOrder: date,
    userId,
    paymentStatusId,
    shippingStatusId,
    shippingAddressId,
  }

  const id = await knex('orders').insert(newOrder)

  if (!id) return null

  for (const item of items) {
    const orderItem = await knex('orderItem').insert({ ...item, orderId: id })
    if (!orderItem) return null
  }
  const createdOrder = await findById(id)
  return createdOrder
}

export interface OrderCreateParams {
  order: any
  userId: number
}

/**
 * Creates an order calculating total and subtotal.
 * @param {order} order order to create
 * @param {int} userId order's user
 * @returns
 */
const create = async ({ order, userId }: OrderCreateParams) => {
  const { dateOrder, items, paymentStatus, shippingAddress } = order

  const paymentStatusSelected = await knex('paymentStatus')
    .select('id')
    .where('name', paymentStatus.toString())
    .first()
  const paymentStatusId = paymentStatusSelected.id

  const shippingStatus = await knex('shippingStatus')
    .select('id')
    .where('name', SHIPPING_UNSHIPPED)
    .first()

  if (!shippingStatus) return null

  const shippingStatusId = shippingStatus.id

  const addressFound = await knex('shippingAddresses')
    .select('id')
    .where(shippingAddress)
    .first()

  let shippingAddressId

  if (addressFound) {
    shippingAddressId = addressFound.id
  } else {
    const res = await knex('shippingAddresses').insert(shippingAddress)
    shippingAddressId = res[0]
  }

  //TODO: Try to use the best format
  // const dateFormat = 'yyyy-MM-dd-hh-mm-ss'
  // const date = dateOrder ? dateOrder : format(new Date(), dateFormat)
  const date = dateOrder ? dateOrder : new Date()

  const itemsAcc = await Promise.all(
    items.map(async (i) => {
      const product = await knex('products')
        .select('*')
        .where('id', i.productId)
        .first()
      if (!product) return null

      const total = i.quantity * product.price
      return { ...i, price: product.price, total, subtotal: total }
    }),
  )

  const total = itemsAcc.reduce((acc, cur) => acc + cur.price * cur.quantity, 0)
  const subtotal = total

  const newOrder = {
    subtotal,
    total,
    dateOrder: date,
    userId,
    paymentStatusId,
    shippingStatusId,
    shippingAddressId,
  }

  const resInsert = await knex('orders').insert(newOrder)
  const id = resInsert[0]

  if (!id) return null

  for (const item of itemsAcc) {
    const orderItem = await knex('orderItem').insert({ ...item, orderId: id })
    if (!orderItem) return null
  }
  const createdOrder = await findById(id)
  return createdOrder
}

const queryOrders = knex('orders as o')
  .distinct()
  .join('orderItem as i', 'i.orderId', 'o.id')
  .leftJoin('users as u', 'u.id', 'o.userId')
  .join('paymentStatus as ps', 'ps.id', 'o.paymentStatusId')
  .join('shippingStatus as ss', 'ss.id', 'o.shippingStatusId')
  .select(
    'o.id as id',
    'o.dateOrder as dateOrder',
    'o.userId as userId',
    'o.total as total',
    'o.subtotal as subtotal',
    'u.firstName as firstName',
    'u.lastName as lastName',
    'u.email as email',
    'ps.name as paymentStatus',
    'ss.name as shippingStatus',
    'o.shippingAddressId as shippingAddressId',
  )

const queryOrderItems = knex('products as p')
  .join('orderItem as i', 'i.productId', 'p.id')
  .join('orders as o', 'o.id', 'i.orderId')
  .select(
    'p.id as id',
    'p.title as title',
    'i.quantity as quantity',
    'p.image as image',
    'i.price as price',
    'i.total as total',
  )

const findById = async (id) => {
  const order = await queryOrders.clone().where('o.id', id).first()

  if (!order) return null

  order.customer = {
    firstName: order.firstName,
    lastName: order.lastName,
    email: order.email,
  }

  const shippingAddress = await knex('shippingAddresses')
    .select('*')
    .where('id', order.shippingAddressId)
    .first()
  if (!shippingAddress) return null

  order.shippingAddress = {
    ...shippingAddress,
  }

  order.items = await findItems(id)

  return order
}

const findItems = async (orderId) => {
  const products = await queryOrderItems.clone().where(`o.id`, orderId)
  return products
}

const find = async (filters, { page = 1, perPage = ITEMS_PER_PAGE } = {}) => {
  const ordersPaginated = await queryOrders
    .clone()
    .where(filters)
    .paginate({ perPage, currentPage: page })

  const orders = ordersPaginated.data

  if (!orders) return null

  for (const order of orders) {
    order.customer = {
      firstName: order.firstName,
      lastName: order.lastName,
    }
    order.items = await findItems(order.id)
  }

  return orders
}

const findAll = async (pagination = {}) => await find({}, pagination)

const findOneByUser = async ({ orderId, userId }) => {
  const order = await queryOrders
    .clone()
    .where('o.id', '=', orderId)
    .andWhere('o.userId', '=', userId)
    .first()

  if (!order) return null

  order.items = await findItems(order.id)
  return order
}

const markShippingStatus = async (orderId, status) => {
  const resSelect = await knex('shippingStatus').where({ name: status }).first()
  const shippingStatusId = resSelect.id
  if (!shippingStatusId) return null

  const resUpdate = await knex(TABLE_NAME)
    .update({ shippingStatusId })
    .where({ id: orderId })

  const order = await findById(orderId)
  return order
}

const tableName = TABLE_NAME
const fields = SELECTABLE_FIELDS

const Order: Model<OrderModel, OrderCreateParams> = {
  tableName,
  fields,
  findOne,
  update,
  destroy,
  destroyAll,
  includesAny,
  create,
  find,
  findAll,
  findById,
  createForStripe,
  findOneByUser,
  markShippingStatus,
}

export default Order

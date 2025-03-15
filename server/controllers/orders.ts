import path from 'path'
import controllerHelper from '../helpers/controllerHelper'
import Order from '../models/order'
import { ORDER_APP, ORDER_STRIPE } from '../types/OrderType'
import ActionStatus from '../types/ActionStatus'
import mapper from '../helpers/propsMapperOutput'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const controllerName = path.parse(__filename).name
const { getAll, getOne } = controllerHelper(controllerName)

const placeOrder = async ({ order, userId }, orderType = ORDER_APP) => {
  try {
    const savedOrder =
      orderType === ORDER_STRIPE
        ? await Order.createForStripe({
            order,
            userId,
          })
        : await Order.create({ order, userId })

    if (savedOrder) {
      return {
        action: ActionStatus.Created,
        payload: mapper.mapOrder(savedOrder),
      }
    }
    return {
      action: ActionStatus.CreateError,
    }
  } catch (err) {
    throw err
  }
}

const getAllByUser = async (id) => {
  try {
    const orders = await Order.find({ userId: id })
    if (orders) {
      return {
        action: ActionStatus.Ok,
        payload: orders.map(mapper.mapOrder),
      }
    }
    return {
      action: ActionStatus.Error,
    }
  } catch (err) {
    throw err
  }
}

const getOneByUser = async ({ orderId, userId }) => {
  try {
    const order = await Order.findOneByUser({ orderId, userId })
    if (order) {
      return {
        action: ActionStatus.Ok,
        payload: mapper.mapOrder(order),
      }
    }
    return {
      action: ActionStatus.Error,
    }
  } catch (err) {
    throw err
  }
}

const markShippingStatus = async (orderId, status) => {
  try {
    const order = await Order.markShippingStatus(orderId, status)
    if (order) {
      return {
        action: ActionStatus.Ok,
        payload: mapper.mapOrder(order),
      }
    }
    return {
      action: ActionStatus.Error,
    }
  } catch (err) {
    throw err
  }
}

const OrdersController = {
  getAll,
  getOne,
  placeOrder,
  getAllByUser,
  getOneByUser,
  markShippingStatus,
}

export default OrdersController

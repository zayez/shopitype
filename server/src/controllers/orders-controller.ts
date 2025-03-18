import ActionStatus from '../types/action-status'
import { ORDER_APP, ORDER_STRIPE } from '../types/order-type'
import controllerHelper from '../helpers/controller-helper'
import mapper from '../helpers/props-mapper-output'
import OrderRepository from '../repositories/order-repository'

const controllerName = 'orders'
const { getAll, getOne } = controllerHelper(controllerName)

const placeOrder = async ({ order, userId }, orderType = ORDER_APP) => {
  try {
    const savedOrder =
      orderType === ORDER_STRIPE
        ? await OrderRepository.createForStripe({
            order,
            userId,
          })
        : await OrderRepository.create({ order, userId })

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
    const orders = await OrderRepository.find({ userId: id })
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
    const order = await OrderRepository.findOneByUser({ orderId, userId })
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
    const order = await OrderRepository.markShippingStatus(orderId, status)
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

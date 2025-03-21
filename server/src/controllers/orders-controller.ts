import ActionStatus from '../types/action-status'
import { ORDER_APP, ORDER_STRIPE } from '../types/order-type'
import controllerHelper from '../helpers/controller-helper'
import mapper from '../helpers/props-mapper-output'
import OrderRepository from '../repositories/order-repository'
import { Order } from '../models/order'
import { ShippingStatusType } from '../types/shipping-status'

const controllerName = 'orders'
const { getAll, getOne } = controllerHelper(controllerName)

const placeOrder = async (
  { order, userId }: { order: Partial<Order>; userId: number },
  orderType = ORDER_APP,
) => {
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
}

const getAllByUser = async (id: number) => {
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
}

const getOneByUser = async ({
  orderId,
  userId,
}: {
  orderId: number
  userId: number
}) => {
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
}

const markShippingStatus = async (
  orderId: number,
  status: ShippingStatusType,
) => {
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

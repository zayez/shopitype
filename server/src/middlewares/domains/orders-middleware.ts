import ActionStatus from '../../types/action-status'
import OrdersController from '../../controllers/orders-controller'
import { setResponse } from '../../helpers/middleware-helpers'
import mapper from '../../helpers/props-mapper-input'
import Koa from 'koa'

const get = async (ctx: Koa.Context) => {
  try {
    const { id } = ctx.params
    const { action, payload } = await OrdersController.getOne(id)
    setResponse(ctx, { action, payload })
  } catch {
    setResponse(ctx, { action: ActionStatus.Error })
  }
}

const getAll = async (ctx: Koa.Context) => {
  try {
    const page = ctx.request.query.page
      ? Number(ctx.request.query.page)
      : undefined
    const { action, payload } = await OrdersController.getAll({
      page,
    })
    setResponse(ctx, { action, payload })
  } catch {
    setResponse(ctx, { action: ActionStatus.Error })
  }
}

const placeOrder = async (ctx: Koa.Context) => {
  try {
    const userId = ctx.state.user.id
    const order = mapper.mapOrder(ctx.request.body)

    const { action, payload } = await OrdersController.placeOrder({
      order,
      userId,
    })
    setResponse(ctx, { action, payload })
  } catch {
    setResponse(ctx, { action: ActionStatus.Error })
  }
}

const getAllByUser = async (ctx: Koa.Context) => {
  try {
    const { userId } = ctx.params
    const { action, payload } = await OrdersController.getAllByUser(userId)
    setResponse(ctx, { action, payload })
  } catch {
    setResponse(ctx, { action: ActionStatus.Error })
  }
}

const getOneByUser = async (ctx: Koa.Context) => {
  try {
    const { orderId, userId } = ctx.params
    const { action, payload } = await OrdersController.getOneByUser({
      orderId,
      userId,
    })
    setResponse(ctx, { action, payload })
  } catch {
    setResponse(ctx, { action: ActionStatus.Error })
  }
}

const markShippingStatus = async (ctx: Koa.Context) => {
  try {
    const { status } = ctx.request.body
    const { id } = ctx.params

    const { action, payload } = await OrdersController.markShippingStatus(
      id,
      status,
    )

    setResponse(ctx, { action, payload })
  } catch {
    setResponse(ctx, { action: ActionStatus.Error })
  }
}

const OrdersMiddleware = {
  getAll,
  get,
  placeOrder,
  getAllByUser,
  getOneByUser,
  markShippingStatus,
}

export default OrdersMiddleware

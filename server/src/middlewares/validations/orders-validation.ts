import ProductsController from '../../controllers/products-controller'
import { setResponse } from '../../helpers/middleware-helpers'
import { isManager } from '../../helpers/user-helpers'
import ActionStatus from '../../types/action-status'
import {
  matchUserId,
  validateBody,
  validateParams,
  validateQuery,
} from '../request-validators'
import {
  GetAll,
  GetAllByUser,
  GetOneByUser,
  PlaceOrder,
  ShippingStatus,
} from '../schemas/orders-schema'
import Koa from 'koa'

const validateGetAll = async (ctx: Koa.Context, next: Koa.Next) =>
  await validateQuery({ ctx, next }, GetAll)

const validateOrder = async (ctx: Koa.Context, next: Koa.Next) => {
  await validateBody({ ctx, next }, PlaceOrder)
}

const validateGetAllByUser = async (ctx: Koa.Context, next: Koa.Next) => {
  await validateParams({ ctx, next }, GetAllByUser)
}

const validateAuthorization = async (ctx: Koa.Context, next: Koa.Next) => {
  if (isManager(ctx.state.user)) {
    await next()
    return
  }
  await matchUserId('userId')(ctx, next)
}

const validateGetOneByUser = async (ctx: Koa.Context, next: Koa.Next) => {
  await validateParams({ ctx, next }, GetOneByUser)
}

const validateItems = async (ctx: Koa.Context, next: Koa.Next) => {
  try {
    const items = ctx.request.body.items
    const { action, payload } = await ProductsController.validateItems(items)
    if (action !== ActionStatus.Ok) {
      setResponse(ctx, { action, payload })
      return
    }
    await next()
  } catch {
    setResponse(ctx, { action: ActionStatus.Error })
  }
}

const validateShippingStatus = async (ctx: Koa.Context, next: Koa.Next) =>
  await validateBody({ ctx, next }, ShippingStatus)

export {
  validateGetAll,
  validateOrder,
  validateItems,
  validateGetAllByUser,
  validateGetOneByUser,
  validateAuthorization,
  validateShippingStatus,
}

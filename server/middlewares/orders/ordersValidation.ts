import ProductsController from '../../controllers/products'
import { setResponse } from '../../helpers/middlewareHelpers'
import { isManager } from '../../helpers/userHelpers'
import ActionStatus from '../../types/ActionStatus'
import {
  matchUserId,
  validateBody,
  validateParams,
  validateQuery,
} from '../validations'
import {
  GetAll,
  GetAllByUser,
  GetOneByUser,
  PlaceOrder,
  ShippingStatus,
} from './ordersSchema'

const validateGetAll = async (ctx, next) =>
  await validateQuery({ ctx, next }, GetAll)

const validateOrder = async (ctx, next) => {
  await validateBody({ ctx, next }, PlaceOrder)
}

const validateGetAllByUser = async (ctx, next) => {
  await validateParams({ ctx, next }, GetAllByUser)
}

const validateAuthorization = async (ctx, next) => {
  if (isManager(ctx.state.user)) {
    await next()
    return
  }
  await matchUserId('userId')(ctx, next)
}

const validateGetOneByUser = async (ctx, next) => {
  await validateParams({ ctx, next }, GetOneByUser)
}

const validateItems = async (ctx, next) => {
  try {
    const items = ctx.request.body.items
    const { action, payload } = await ProductsController.validateItems(items)
    if (action !== ActionStatus.Ok) {
      setResponse(ctx, { action, payload })
      return
    }
    await next()
  } catch (err) {
    setResponse(ctx, { action: ActionStatus.Error })
  }
}

const validateShippingStatus = async (ctx, next) =>
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

import ActionStatus from '../../types/action-status'
import StripeCheckoutController from '../../controllers/stripe-checkout-controller'
import { setResponse } from '../../helpers/middleware-helpers'
import Koa from 'koa'

const create = async (ctx: Koa.Context) => {
  try {
    const { items } = ctx.request.body
    const { userId } = ctx.request.body
    const { action, payload } = await StripeCheckoutController.create({
      items,
      userId,
    })
    setResponse(ctx, { action, payload })
  } catch (err) {
    console.log(err)
    setResponse(ctx, { action: ActionStatus.Error })
  }
}

const get = async (ctx: Koa.Context) => {
  try {
    let { id } = ctx.query
    if (id) {
      if (Array.isArray(id)) {
        id = id[0]
      }
      const { action, payload } = await StripeCheckoutController.get(id)
      setResponse(ctx, { action, payload })
    }
  } catch (err) {
    setResponse(ctx, { action: ActionStatus.Error })
  }
}

const StripeCheckoutMiddleware = { create, get }

export default StripeCheckoutMiddleware

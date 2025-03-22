import Router from 'koa-router'
import { GET_STRIPE_CHECKOUT, POST_STRIPE_CHECKOUT } from '../api/endpoint-urls'
import compose from 'koa-compose'
import { authorizeCustomer } from '../middlewares/authorization'
import StripeCheckoutMiddleware from '../middlewares/domains/stripe-checkout-middleware'
import Koa from 'koa'

const router = new Router<Koa.DefaultState, Koa.DefaultContext>()

//TODO: Add proper validations in the middleware (userId & items)
const create = compose([authorizeCustomer, StripeCheckoutMiddleware.create])

const get = compose([StripeCheckoutMiddleware.get])

router.post(POST_STRIPE_CHECKOUT, create)
router.get(GET_STRIPE_CHECKOUT, get)

export default router

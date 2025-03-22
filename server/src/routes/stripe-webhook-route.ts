import Router from 'koa-router'
import { POST_STRIPE_WEBHOOK } from '../api/endpoint-urls'
import compose from 'koa-compose'
import StripeWebhookMiddleware from '../middlewares/domains/stripe-webhook-middleware'
import Koa from 'koa'

const router = new Router<Koa.DefaultState, Koa.DefaultContext>()

const create = compose([StripeWebhookMiddleware.create])

router.post(POST_STRIPE_WEBHOOK, create)

export default router

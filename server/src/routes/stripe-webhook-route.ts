import Router from 'koa-router'
import { POST_STRIPE_WEBHOOK } from '../api/endpoint-urls'
import compose from 'koa-compose'
import StripeWebhookMiddleware from '../middlewares/domains/stripe-webhook-middleware'

const router = new Router()

const create = compose([StripeWebhookMiddleware.create])

router.post(POST_STRIPE_WEBHOOK, create)

export default router

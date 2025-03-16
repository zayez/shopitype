import Router from 'koa-router'
import { POST_STRIPE_WEBHOOK } from '../api/endpointUrls'
import StripeWebhookPipeline from '../middlewares/stripeWebhook'

const router = new Router()

router.post(POST_STRIPE_WEBHOOK, StripeWebhookPipeline.create)

export default router

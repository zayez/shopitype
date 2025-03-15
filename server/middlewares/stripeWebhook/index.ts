import compose from 'koa-compose'
import StripeWebhookMiddleware from './stripeWebhookMiddleware'

const create = compose([StripeWebhookMiddleware.create])

const StripeWebhookPipeline = { create }

export default StripeWebhookPipeline

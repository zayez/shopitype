import Router from 'koa-router'
import { GET_STRIPE_CHECKOUT, POST_STRIPE_CHECKOUT } from '../api/endpointUrls'
import StripeCheckoutPipeline from '../middlewares/stripeCheckout'

const router = new Router()

router.post(POST_STRIPE_CHECKOUT, StripeCheckoutPipeline.create)
router.get(GET_STRIPE_CHECKOUT, StripeCheckoutPipeline.get)

export default router

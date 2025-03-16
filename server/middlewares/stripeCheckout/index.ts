import compose from 'koa-compose'
import { authorizeCustomer } from '../authorization'
import StripeCheckoutMiddleware from './stripeCheckoutMiddleware'

//TODO: Add proper validations in the middleware (userId & items)
const create = compose([authorizeCustomer, StripeCheckoutMiddleware.create])

const get = compose([StripeCheckoutMiddleware.get])

const StripeCheckoutPipeline = { create, get }

export default StripeCheckoutPipeline

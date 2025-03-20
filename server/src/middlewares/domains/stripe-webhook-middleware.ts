import Stripe from 'stripe'
import config from '../../config/config'
import OrdersController from '../../controllers/orders-controller'
import { setResponse } from '../../helpers/middleware-helpers'
import { PAYMENT_PAID, PAYMENT_UNPAID } from '../../types/payment-status'
import { ORDER_STRIPE } from '../../types/order-type'
import ActionStatus from '../../types/action-status'
import Koa from 'koa'

const STRIPE_KEY = config.stripe.KEY
const STRIPE_CLI_KEY = config.stripe.CLI_KEY

const stripe = new Stripe(STRIPE_KEY, { apiVersion: '2022-11-15' })

const create = async (ctx: Koa.Context) => {
  let event
  try {
    const sigHeader = ctx.request.headers['stripe-signature']
    const sig = Array.isArray(sigHeader) ? sigHeader.join('') : sigHeader

    if (!sig) {
      throw new Error('Missing stripe signature')
    }
    const body = ctx.request.rawBody

    event = stripe.webhooks.constructEvent(body, sig, STRIPE_CLI_KEY)

    const session = event.data.object as Stripe.Checkout.Session

    if (
      !session.customer_details ||
      !session.customer_details.address ||
      !session.amount_total ||
      !session.amount_subtotal
    ) {
      throw new Error('Missing customer_details or address in session or total')
    }

    const eventType = event.type

    if (eventType === 'checkout.session.completed') {
      const { amount_total, amount_subtotal, payment_status } = session
      const paymentStatus =
        payment_status === PAYMENT_PAID ? PAYMENT_PAID : PAYMENT_UNPAID
      const customerId = session.customer
      const address = session.customer_details.address
      const shippingAddress = {
        addressLine1: address.line1,
        addressLine2: address.line2,
        city: address.city,
        country: address.country,
        state: address.state,
        postalCode: address.postal_code,
      }
      const { line_items } = await stripe.checkout.sessions.retrieve(
        session.id,
        {
          expand: ['line_items', 'line_items.data.price.product'],
        },
      )

      if (!line_items) {
        throw new Error('Missing line_items in session')
      }

      const items = line_items.data.map(mapLineItems)

      if (typeof session.customer !== 'string') {
        throw new Error('Invalid customer ID')
      }

      const customer = await stripe.customers.retrieve(session.customer)
      const customerData = customer as Stripe.Customer

      const { userId } = customerData.metadata
      const order = {
        total: amount_total / 100,
        subtotal: amount_subtotal / 100,
        shippingAddress,
        paymentStatus,
        items,
      }
      const { action, payload } = await OrdersController.placeOrder(
        {
          order,
          userId: Number(userId),
        },
        ORDER_STRIPE,
      )
      setResponse(ctx, { action, payload })
    }
  } catch (err) {
    setResponse(ctx, { action: ActionStatus.Error })
  }
}

function mapLineItems(i: Stripe.LineItem) {
  if (!i.price) {
    throw new Error('Missing price in line item')
  }
  let productId: string

  if (typeof i.price.product === 'string') {
    productId = i.price.product
  } else if ('metadata' in i.price.product && i.price.product.metadata) {
    productId = i.price.product.metadata.productId
  } else {
    throw new Error('Unexpected product type or missing metadata')
  }
  if (i.price === null) {
    throw new Error('Price unit_amount is missing')
  }
  return {
    subtotal: i.amount_subtotal / 100,
    total: i.amount_total / 100,
    price: i.price.unit_amount ?? 0 / 100,
    quantity: i.quantity ?? undefined,
    productId: Number(productId),
  }
}

const StripeWebhookMiddleware = { create }

export default StripeWebhookMiddleware

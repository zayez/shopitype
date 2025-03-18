import ActionStatus from '../types/action-status'
import isEqual from 'lodash/isEqual'
import Stripe from 'stripe'

import config from '../config/config'
import ProductRepository from '../repositories/product-repository'

const CLIENT_URL = config.CLIENT_URL
const STRIPE_KEY = config.stripe.KEY
const stripe = new Stripe(STRIPE_KEY, { apiVersion: '2022-11-15' })

const create = async ({ items, userId }) => {
  try {
    const customer = await stripe.customers.create({
      metadata: {
        userId,
      },
    })

    const products = await ProductRepository.findAllIn(items.map((i) => i.id))
    const productsIds = products.map((i) => i.id)
    const itemsIds = items.map((i) => i.id)

    if (!isEqual(productsIds.sort(), itemsIds.sort())) {
      return { action: ActionStatus.BadRequest }
    }

    const line_items = items.map((item) => {
      const product = products.find((p) => p.id === item.id)
      return {
        price_data: {
          currency: 'usd',
          product_data: {
            name: product.title,
            metadata: {
              productId: item.id,
            },
          },
          unit_amount: product.price * 100,
        },
        quantity: item.quantity,
      }
    })

    // TODO: Configure shipping options properly
    const shippingAddressCollection: Stripe.Checkout.SessionCreateParams.ShippingAddressCollection =
      {
        allowed_countries: ['US', 'BR'],
      }
    const shippingOptions = [
      {
        shipping_rate_data: {
          type: 'fixed_amount' as const,
          fixed_amount: { amount: 0, currency: 'usd' },
          display_name: 'Free shipping',
          delivery_estimate: {
            minimum: { unit: 'business_day' as const, value: 5 },
            maximum: { unit: 'business_day' as const, value: 7 },
          },
        },
      },
    ]

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      customer: customer.id,
      shipping_address_collection: shippingAddressCollection,
      shipping_options: shippingOptions,
      line_items,
      success_url: `http://${CLIENT_URL}/success?id={CHECKOUT_SESSION_ID}`,
      cancel_url: `http://${CLIENT_URL}/cart?id={CHECKOUT_SESSION_ID}`,
    })

    return { action: ActionStatus.Ok, payload: { url: session.url } }
  } catch (err) {
    throw err
  }
}

const get = async (id) => {
  try {
    const session = await stripe.checkout.sessions.retrieve(id, {
      expand: ['line_items'],
    })
    return { action: ActionStatus.Ok, payload: session }
  } catch (err) {
    throw err
  }
}

const StripeCheckoutController = {
  create,
  get,
}

export default StripeCheckoutController

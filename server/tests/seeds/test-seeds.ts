import rolesJson from '../../db/seeds/data/roles.json' with {type: 'json'}
const roles = rolesJson.roles

import productStatusesJson from '../../db/seeds/data/productStatuses.json' with {type: 'json'}
const productStatuses = productStatusesJson.productStatuses

import  shippingAddressesJson from '../fixtures/shippingAddresses.json' with {type: 'json'}
const shippingAddresses = shippingAddressesJson

import usersJson from '../fixtures/users.json' with {type: 'json'}

const admins = usersJson.admins
const editors = usersJson.editors
const customers = usersJson.customers

import categoriesJson from '../fixtures/categories.json'  with {type: 'json'}
const categories = categoriesJson.categories

import productsJson from '../fixtures/products.json' with {type: 'json'}
const products = productsJson.products


import ordersJson from '../fixtures/orders.json' with {type: 'json'}
import { type Knex } from 'knex'
import Order, { OrderModel } from '../../models/order'
import { PAYMENT_PAID } from '../../types/PaymentStatus'
import User from '../../models/user'
import Category from '../../models/category'
import Product from '../../models/product'
const orders = ordersJson.orders as OrderModel[]

export async function seed(knex: Knex): Promise<void> {
  await knex('roles').del()
  await knex('roles').insert(roles)
  await knex('users').del()
  await knex('userRoles').del()

  for (const admin of admins) await User.create({user: admin, roles: ['admin']})
  for (const editor of editors) await User.create({user: editor, roles: ['editor']})
  for (const customer of customers) await User.create({user: customer, roles: ['customer']})

  await knex('categories').del()
  for (const category of categories) {
    await Category.create(category)
  }
  await knex('productStatus').del()
  await knex('productStatus').insert(productStatuses[0])
  await knex('productStatus').insert(productStatuses[1])

  await Product.destroyAll()

  for (const product of products) {
    await Product.create(product)
  }

  await knex('orderItem').del()
  await knex('orders').del()

  await knex('shippingAddresses').del()

  for (const order of orders) {
    const addr = shippingAddresses.find((i) => i.id === order.shippingAddressId)
    order.shippingAddress = mapShippingAddress(addr)
    order.paymentStatus = PAYMENT_PAID
    await Order.create({
      order,
      userId: order.userId,
    })
  }
}

function mapShippingAddress(item) {
  return {
    addressLine1: item.addressLine1,
    addressLine2: item.addressLine2,
    city: item.city,
    country: item.country,
    state: item.state,
    postalCode: item.postalCode,
  }
}

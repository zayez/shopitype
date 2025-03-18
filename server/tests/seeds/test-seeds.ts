import rolesJson from '../../src/db/seeds/data/roles.json' with {type: 'json'}
const roles = rolesJson.roles

import productStatusesJson from '../../src/db/seeds/data/product-statuses.json' with {type: 'json'}
const productStatuses = productStatusesJson.productStatuses

import paymentStatusJson from '../../src/db/seeds/data/payment-status.json' with { type: "json" };

import  shippingAddressesJson from '../fixtures/shipping-addresses.json' with {type: 'json'}
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
import { PAYMENT_PAID } from '../../src/types/payment-status'
import { Order } from '../../src/models/order';
import UserRepository from '../../src/repositories/user-repository';
import CategoryRepository from '../../src/repositories/category-repository';
import ProductRepository from '../../src/repositories/product-repository';
import OrderRepository from '../../src/repositories/order-repository';
const orders = ordersJson.orders as Order[]

export async function seed(knex: Knex): Promise<void> {
  await knex('roles').del()
  await knex('roles').insert(roles)
  await knex('users').del()
  await knex('userRoles').del()

  for (const admin of admins) await UserRepository.create({user: admin, roles: ['admin']})
  for (const editor of editors) await UserRepository.create({user: editor, roles: ['editor']})
  for (const customer of customers) await UserRepository.create({user: customer, roles: ['customer']})

  await knex('categories').del()
  for (const category of categories) {
    await CategoryRepository.create(category)
  }
  await knex('productStatus').del()
  await knex('productStatus').insert(productStatuses[0])
  await knex('productStatus').insert(productStatuses[1])

  await knex('paymentStatus').del()
  await knex('paymentStatus').insert(paymentStatusJson[0])
  await knex('paymentStatus').insert(paymentStatusJson[1])

  await ProductRepository.destroyAll()

  for (const product of products) {
    await ProductRepository.create(product)
  }

  await knex('orderItem').del()
  await knex('orders').del()

  await knex('shippingAddresses').del()

  for (const order of orders) {

    const addr = shippingAddresses.find((i) => i.id === order.shippingAddressId)
    order.shippingAddress = mapShippingAddress(addr)
    order.paymentStatus = PAYMENT_PAID
    await OrderRepository.create({
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

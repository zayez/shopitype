import { type Knex } from 'knex'
import paymentStatusjson from './data/paymentStatus.json' with { type: "json" };
import shipmentStatusjson from './data/shippingStatus.json' with { type: "json" };

const paymentStatus = paymentStatusjson
const shippingStatus = shipmentStatusjson

export async function seed(knex: Knex): Promise<void> {
  await knex('paymentStatus').del()
  await knex('shippingStatus').del()
  await knex('paymentStatus').insert(paymentStatus)
  await knex('shippingStatus').insert(shippingStatus)
  await knex('orderItem').del()
  await knex('orders').del()
}

import { type Knex } from 'knex'
import productStasesjson from './data/productStatuses.json' with { type: "json" };

const productStatuses = productStasesjson.productStatuses

export async function seed(knex: Knex): Promise<void> {
  await knex('productStatus').del()
  await knex('productStatus').insert(productStatuses)
  await knex('products').del()
}

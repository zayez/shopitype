import { type Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('paymentStatus', (table) => {
    table.increments()
    table.enu('name', ['paid', 'unpaid']).notNullable()
    table.timestamps(true, true, true)
  })

  await knex.schema.createTable('shippingStatus', (table) => {
    table.increments()
    table.enu('name', ['unshipped', 'shipped', 'delivered']).notNullable()
    table.timestamps(true, true, true)
  })

  await knex.schema.createTable('orders', (table) => {
    table.increments()
    table.integer('userId').references('id').inTable('users').notNullable()
    table
      .integer('paymentStatusId')
      .references('id')
      .inTable('paymentStatus')
      .notNullable()
    table
      .integer('shippingStatusId')
      .references('id')
      .inTable('shippingStatus')
      .notNullable()
    table
      .integer('shippingAddressId')
      .references('id')
      .inTable('shippingAddresses')
      .notNullable()
    table.datetime('dateOrder')
    table.decimal('subtotal').notNullable()
    table.decimal('total').notNullable()
    table.timestamps(true, true, true)
  })

  await knex.schema.createTable('orderItem', (table) => {
    table.increments()
    table
      .integer('productId')
      .references('id')
      .inTable('products')
      .notNullable()
    table.integer('orderId').references('id').inTable('orders').notNullable()
    table.decimal('price').notNullable()
    table.decimal('subtotal').notNullable()
    table.decimal('total').notNullable()
    table.integer('quantity').notNullable()
    table.timestamps(true, true, true)
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('orderItem')
  await knex.schema.dropTable('orders')
  await knex.schema.dropTable('paymentStatus')
  await knex.schema.dropTable('shippingStatus')
}

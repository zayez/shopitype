import { type Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('productStatus', (table) => {
    table.increments()
    table.enu('name', ['draft', 'active']).notNullable()
    table.timestamps(true, true, true)
  })

  const product = await knex.schema.createTable('products', (table) => {
    table.increments()
    table.text('title').notNullable().unique()
    table.text('description')
    table.decimal('price')
    table.integer('inventory')
    table.text('image')
    table.integer('statusId').references('id').inTable('productStatus')
    table.integer('categoryId').references('id').inTable('categories')
    table.timestamps(true, true, true)
  })

  return product
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('products')
  await knex.schema.dropTable('productStatus')
}

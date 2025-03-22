import { type Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('shippingAddresses', (table) => {
    table.increments()
    table.text('addressLine1').notNullable()
    table.text('addressLine2')
    table.text('city').notNullable()
    table.text('country').notNullable()
    table.text('state').notNullable()
    table.text('postalCode').notNullable()
    table.timestamps(true, true, true)
  })
}

export async function down(): Promise<void> {
  // Implement rollback logic if needed. For example:
  // await knex.schema.dropTable("shippingAddresses");
}

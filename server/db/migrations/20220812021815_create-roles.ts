import { type Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('roles', (table) => {
    table.increments()
    table.text('name').notNullable().unique()
    table.timestamps(true, true, true)
  })
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('roles')
}

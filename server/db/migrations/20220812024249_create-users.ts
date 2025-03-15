import { type Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('users', (table) => {
    table.increments()
    table.text('firstName').notNullable()
    table.text('lastName').notNullable()
    table.text('email').notNullable().unique()
    table.text('password').notNullable()
    table.timestamps(true, true, true)
  })

  await knex.schema.createTable('userRoles', (table) => {
    table.increments()
    table.integer('userId').references('id').inTable('users')
    table.integer('roleId').references('id').inTable('roles')
    table.timestamps(true, true, true)
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('userRoles')
  await knex.schema.dropTable('users')
}

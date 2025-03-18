import { type Knex } from 'knex'
import rolesjson from './data/roles.json' with { type: "json" };

const roles = rolesjson.roles

export async function seed(knex: Knex): Promise<void> {
  await knex('roles').del()
  await knex('roles').insert(roles)
}

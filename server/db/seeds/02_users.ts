import { type Knex } from 'knex'
import User from '../../models/user'
import usersjson from './data/users.json' with { type: "json" }

const users = usersjson.users

export async function seed(knex: Knex): Promise<void> {
  await knex('users').del()
  await knex('userRoles').del()

  for (const user of users) {
    await User.create({ user, roles: user.roles })
  }
}

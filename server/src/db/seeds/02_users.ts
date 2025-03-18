import { type Knex } from 'knex'
import usersjson from './data/users.json' with { type: "json" }
import UserRepository from '../../repositories/user-repository'

const users = usersjson.users

export async function seed(knex: Knex): Promise<void> {
  await knex('users').del()
  await knex('userRoles').del()

  for (const user of users) {
    await UserRepository.create({ user, roles: user.roles })
  }
}

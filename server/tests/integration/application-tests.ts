import test from 'tape'
import knex from '../../src/db/db'
import { faker } from '@faker-js/faker'
import {
  server,
  getRoot,
  signIn,
  signUp,
  getUser,
} from '../requests/application-request'
import  { login, decodeToken } from '../infrastructure/login'
import STATUS from '../../src/types/status-code'

import customersjson from '../fixtures/users.json' with { type: "json" }

const customers = customersjson.customers

test('setup', async (t) => {
  await knex.migrate.latest();
  await knex.seed.run({ directory: 'tests/seeds' })
  t.end()
})

test('As a visitor I should:', (t) => {
  t.test('setup', async (assert) => {
    assert.end()
  })

  t.test('be able to access root endpoint', async (assert) => {
    const res = await getRoot(STATUS.Ok)
    assert.equal(res.body.greeting, 'hella!')
    assert.end()
  })

  t.test('be able to sign up', async (assert) => {
    const user = createRandomUser()

    const res = await signUp(user, { status: STATUS.Created })
    assert.equal(res.status, STATUS.Created)
    assert.ok(res.body instanceof Object && res.body.constructor === Object)
    assert.notEqual(res.body.token, '')
    assert.end()
  })

  t.test('NOT be able to sign up with email already used', async (assert) => {
    const user = await knex('users').first()
    const newUser = createRandomUser()
    newUser.email = user.email
    const res = await signUp(newUser, { status: STATUS.Conflict })

    assert.equal(res.status, STATUS.Conflict)
    assert.end()
  })

  test('teardown', async (t) => {
    t.end()
  })
})

test('As a customer I should:', (t) => {
  const customer = customers[0]

  t.test('setup', async (assert) => {
    assert.end()
  })

  t.test('be able to sign in', async (assert) => {
    const res = await signIn(customer.email, customer.password, {
      status: STATUS.Ok,
    })
    assert.equal(res.status, STATUS.Ok)
    assert.notEqual(res.body.token, '', 'token is not empty')
    assert.end()
  })

  t.test('be able to get my user', async (assert) => {
    const token = await login(customer.email, customer.password)
    const userId = decodeToken(token)
    const res = await getUser({ token, status: STATUS.Ok })
    const id = res.body.id

    assert.equal(id, userId, 'userId match')
    assert.end()
  })

  test('teardown', async (t) => {
    t.end()
  })
})

test('teardown', async (t) => {
  await server.close()
  t.end()
})

function createRandomUser() {
  return {
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
  }
}

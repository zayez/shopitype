import test from 'tape'
import jwt from 'jsonwebtoken'
import knex from '../../src/db/db'
import STATUS from '../../src/types/status-code'
import { login } from '../infrastructure/login'
import {
  server,
  create,
  update,
  destroy,
  getOne,
  getAll,
} from '../requests/users-request'
import config from '../../src/config/config'
const { SECRET } = config.jwt

import usersJson from '../fixtures/users.json'
import UserRepository from '../../src/repositories/user-repository'

const customers = usersJson.customers
const editors = usersJson.editors
const admins = usersJson.admins

test('setup', async (t) => {
  await knex.migrate.latest()
  await knex.seed.run()
  t.end()
})

test('As an admin I should:', (t) => {
  let token
  let admin = admins[0]

  t.test('setup', async (assert) => {
    token = await login(admin.email, admin.password)
    assert.end()
  })

  t.test('be able to create a new user', async (assert) => {
    const user = { ...customers[0] }
    delete user.id
    const res = await create(user, { token, status: STATUS.Created })
    const newUser = res.body

    assert.equal(res.status, STATUS.Created)
    assert.equal(newUser.email, user.email)
    assert.equal(newUser.firstName, user.firstName)
    assert.ok(Number.isInteger(newUser.id))
    assert.end()
  })

  test('teardown', async (t) => {
    t.end()
  })

  t.end()
})

test('As a customer I should:', (t) => {
  let token
  let userId
  const customer = customers[0]

  t.test('setup', async (assert) => {
    await knex.seed.run({ directory: 'tests/seeds' })
    token = await login(customer.email, customer.password)
    const decodedToken = jwt.verify(token, SECRET)
    userId = decodedToken.sub

    assert.end()
  })

  t.test('be able to sign in', async (assert) => {
    assert.notEqual(token, '')
    assert.end()
  })

  t.test('be able to update my name', async (assert) => {
    const name = 'Harold'
    const res = await update(
      userId,
      { firstName: name },
      { token, status: STATUS.Ok },
    )
    const updatedUser = res.body

    assert.equal(res.status, STATUS.Ok)
    assert.equal(updatedUser.firstName, name)
    assert.equal(updatedUser.id, userId)
    assert.ok(Number.isInteger(updatedUser.id))
    assert.end()
  })

  t.test('NOT be able to update another user', async (assert) => {
    const name = 'Bean'
    const users = await UserRepository.find({ lastName: 'Doe' })
    const res = await update(
      users[0].id,
      { firstName: name },
      { token, status: STATUS.NotFound },
    )

    assert.equal(res.status, STATUS.NotFound)
    assert.end()
  })

  t.test('be able to update my password', async (assert) => {
    const newPassword = 'abcd1234'
    const res = await update(
      userId,
      { password: newPassword },
      { token, status: STATUS.Ok },
    )
    const updatedUser = await UserRepository.findById(userId)
    const isMatch = await UserRepository.comparePassword(
      newPassword,
      updatedUser.password,
    )

    assert.equal(res.status, STATUS.Ok)
    assert.ok(isMatch)
    assert.end()
  })
  t.test('be able to get my data', async (assert) => {
    const persistedUser = await UserRepository.findById(userId)
    const res = await getOne(userId, { token, status: STATUS.Ok })
    const retrievedUser = res.body

    assert.equal(retrievedUser.firstName, persistedUser.firstName)
    assert.equal(retrievedUser.email, persistedUser.email)
    assert.end()
  })

  t.test('be able to delete my account', async (assert) => {
    const res = await destroy(userId, { token, status: STATUS.Ok })
    const deletedUser = await UserRepository.findById(userId)

    assert.equal(res.status, STATUS.Ok)
    assert.equal(deletedUser, null)
    assert.end()
  })

  test('teardown', async (t) => {
    await knex.seed.run()
    t.end()
  })

  t.end()
})

test('As an editor I should:', (t) => {
  let token
  let editorId = null
  const editor = editors[0]

  t.test('setup', async (assert) => {
    await knex.seed.run({ directory: 'tests/seeds' })
    token = await login(editor.email, editor.password)
    const decodedToken = jwt.verify(token, SECRET)
    editorId = decodedToken.sub

    assert.end()
  })

  t.test('be able to sign in', async (assert) => {
    assert.notEqual(token, '')
    assert.notEqual(editorId, null)
    assert.end()
  })

  t.test('be able to get all users', async (assert) => {
    const res = await getAll({ token, status: STATUS.Ok })
    const retrivedUsers = res.body
    const storedUsers = await UserRepository.findAll()

    assert.equal(res.status, STATUS.Ok)
    assert.equal(retrivedUsers.length, storedUsers.length)
    assert.end()
  })

  t.test('be able to get a specific user', async (assert) => {
    const customer = await UserRepository.findOne({
      firstName: customers[1].firstName,
    })
    const res = await getOne(customer.id, { token, status: STATUS.Ok })
    const retrievedUser = res.body

    assert.equal(retrievedUser.lastName, customer.lastName)
    assert.end()
  })

  test('teardown', async (t) => {
    await knex.seed.run()
    t.end()
  })

  t.end()
})

test('teardown', async (t) => {
  await server.close()
  t.end()
})

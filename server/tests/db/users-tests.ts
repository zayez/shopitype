import test from 'tape'
import  knex from '../../src/db/db'
import usersJson from '../fixtures/users.json' with {type: 'json'}
import UserRepository from '../../src/repositories/user-repository'
const admin = usersJson.admins[0]

test('setup', async (t) => {
  await knex.migrate.latest()
  await knex.seed.run()
  t.end()
})

test('userRoles tests', (t) => {
  t.test('setup', async (assert) => {
    assert.end()
  })

  t.test('user joedoe should have admin role', async (assert) => {
    const user = await knex('users')
      .select('id')
      .where('email', admin.email)
      .first()
    assert.ok(await UserRepository.hasRole(user, ['admin']), 'user has admin role')
  })
  t.end()
})

test('find user', (t) => {
  t.test('setup', async (assert) => {
    assert.end()
  })

  t.test('should find user joe doe', async (assert) => {
    const user = await UserRepository.findOne({ email: admin.email })
    assert.equal(user.firstName, 'Joe')
  })
  t.end()
})

test('password', (t) => {
  t.test('setup', async (assert) => {
    assert.end()
  })

  t.test('password should be a match', async (assert) => {
    const isPasswordMatch = await UserRepository.matchPassword(
      admin.email,
      admin.password,
    )
    assert.ok(isPasswordMatch, 'password is a match')
  })

  t.test('password should not be a match', async (assert) => {
    const isPasswordMatch = await UserRepository.matchPassword(admin.email, 'NOPENOPE')
    assert.notOk(isPasswordMatch, 'password is not a match')
  })

  t.end()
})

test('teardown', async (t) => {
  t.end()
})

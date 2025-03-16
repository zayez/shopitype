import test from 'tape'
import knex from '../../db'

import categoriesJson from '../fixtures/categories.json' with {type: 'json'}
const categories = categoriesJson.categories

import users from '../fixtures/users.json' with {type: 'json'}
const admins = users.admins

import STATUS from '../../types/StatusCode'
import { login } from '../infrastructure/login'
import {
  server,
  create,
  update,
  destroy,
  getOne,
  get,
  getAll,
} from '../requests/categories'

test('setup', async (t) => {
  t.end()
})

test('[clean db] As admin I should:', (t) => {
  let token
  let admin = admins[0]

  t.test('setup', async (assert) => {
    await knex.migrate.latest()
    await knex.seed.run()

    token = await login(admin.email, admin.password)
    assert.end()
  })

  t.test('be able to create a category', async (assert) => {
    const category = { title: 'Books' }

    const res = await create(category, {
      token,
      status: STATUS.Created,
    })

    const createdCategory = res.body

    assert.equal(res.status, STATUS.Created)
    assert.equal(createdCategory.title, 'Books')
    assert.end()
  })

  t.test('be able to update a category', async (assert) => {
    const categoryCreate = { title: 'Eletroniks' }
    const resCreate = await create(categoryCreate, {
      token,
      status: STATUS.Created,
    })
    const categoryUpdate = { title: 'Eletronics' }
    const resUpdate = await update(resCreate.body.id, categoryUpdate, {
      token,
      status: STATUS.Ok,
    })

    const updatedCategory = resUpdate.body

    assert.equal(resUpdate.status, STATUS.Ok)
    assert.equal(updatedCategory.title, 'Eletronics')
    assert.end()
  })

  t.test(
    "NOT be able to update a category that don't exists",
    async (assert) => {
      const category = { title: 'Hardware' }
      const res = await update(23434, category, {
        token,
        status: STATUS.NotFound,
      })
      assert.equal(res.status, STATUS.NotFound)
      assert.end()
    },
  )

  t.test('be able to delete a category', async (assert) => {
    let catTitle = 'Beverages'
    const category = { title: catTitle }
    const resCreate = await create(category, { token, status: STATUS.Created })
    const catCreated = resCreate.body
    const res = await destroy(catCreated.id, { token, status: STATUS.Ok })
    const deletedCategory = await knex('categories')
      .where({ title: catTitle })
      .first()

    assert.equal(res.status, STATUS.Ok)
    assert.equal(deletedCategory, undefined)
    assert.end()
  })

  t.test(
    'NOT be able to retrieve category with id as string',
    async (assert) => {
      const category = { title: 'Clothes' }
      const resCreate = await create(category, {
        token,
        status: STATUS.Created,
      })
      const resCat = resCreate.body
      const res = await getOne('clothes', {
        token,
        status: STATUS.Unprocessable,
      })
      assert.equal(res.status, STATUS.Unprocessable)
      assert.end()
    },
  )

  t.test('be able to retrieve a category', async (assert) => {
    const category = { title: 'Cars' }
    const resCreate = await create(category, { token, status: STATUS.Created })
    const catCreated = resCreate.body

    const res = await getOne(catCreated.id, { token, status: STATUS.Ok })
    const retrievedCategory = res.body

    assert.equal(res.status, STATUS.Ok)
    assert.equal(retrievedCategory.title, 'Cars', 'equal name')
    assert.end()
  })

  t.test('teardown', async (assert) => {
    await knex.seed.run()
    assert.end()
  })

  t.end()
})

test('[seeded db] As admin I should', (t) => {
  let token
  let admin = admins[0]

  t.test('setup', async (assert) => {
    await knex.migrate.latest()
    await knex.seed.run({ directory: 'tests/seeds' })

    token = await login(admin.email, admin.password)
    assert.end()
  })

  t.test('NOT be able to create a category that exists', async (assert) => {
    const category = { ...categories[0] }
    delete category.id
    const res = await create(category, { token, status: STATUS.Conflict })

    assert.equal(res.status, STATUS.Conflict)
    assert.end()
  })

  t.test('be able to retrieve a category', async (assert) => {
    const category = categories[1]
    const res = await getOne(category.id, { token, status: STATUS.Ok })
    const retrievedCategory = res.body

    assert.equal(res.status, STATUS.Ok)
    assert.equal(retrievedCategory.title, 'Eletronics', 'equal name')
    assert.end()
  })

  t.test('be able to retrieve all categories', async (assert) => {
    const res = await getAll({ token, status: STATUS.Ok })

    assert.equal(res.status, STATUS.Ok, 'Category retrieved')
    assert.ok(Array.isArray(res.body))
    assert.end()
  })

  t.test(
    'NOT be able to retrieve categories with page query as string',
    async (assert) => {
      const queryString = '?page=one'
      const res = await get(queryString, {
        token,
        status: STATUS.Unprocessable,
      })

      assert.equal(res.status, STATUS.Unprocessable)
      assert.end()
    },
  )

  t.test('teardown', async (assert) => {
    await knex.seed.run()
    assert.end()
  })
})

test('teardown', async (t) => {
  await server.close()
  t.end()
})

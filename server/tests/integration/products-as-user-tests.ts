import test from 'tape'
import knex from '../../src/db/db'
import STATUS from '../../src/types/status-code'
import { server, create, getOne, getAll } from '../requests/products-request'
import productsJson from '../fixtures/products.json'
const products = productsJson.products

test('setup', async (t) => {
  t.end()
})

test('As a visitor I should:', (t) => {
  t.test('setup', async (assert) => {
    await knex.migrate.latest()
    await knex.seed.run({ directory: 'tests/seeds' })

    assert.end()
  })

  t.test(
    'NOT be able to create a product when unauthenticated',
    async (assert) => {
      const { id, ...prod } = products[0]

      const res = await await create(prod, { status: STATUS.Unauthorized })

      assert.equal(res.status, STATUS.Unauthorized)
      assert.end()
    },
  )

  t.test('be able to retrieve only active products', async (assert) => {
    const res = await getAll({ status: STATUS.Ok })
    const prodsDraft = res.body.filter(
      (p: { statusId: number }) => p.statusId == 1,
    )
    const retrievedProducts = res.body
    assert.equal(res.status, STATUS.Ok)
    assert.ok(Array.isArray(retrievedProducts))
    assert.equal(prodsDraft.length, 0, 'only active products')
    assert.end()
  })

  t.test('be able to retrieve an active product', async (assert) => {
    const product = await knex('products').where({ statusId: 2 }).first()
    const res = await getOne(product.id, { status: STATUS.Ok })
    const retrievedProduct = res.body
    assert.equal(res.status, STATUS.Ok)
    assert.equal(retrievedProduct.title, product.title)
    assert.end()
  })

  t.test('NOT be able to retrieve a draft product', async (assert) => {
    const product = await knex('products').where({ statusId: 1 }).first()
    const res = await getOne(product.id, { status: STATUS.NotFound })

    assert.equal(res.status, STATUS.NotFound)
    assert.end()
  })

  t.test('teardown', async (assert) => {
    await knex.seed.run()
    assert.end()
  })
})

test('teardown', async (t) => {
  await server.close()
  t.end()
})

import test from 'tape'
import { faker } from '@faker-js/faker'
import knex from '../../db'
import STATUS from '../../types/StatusCode'
import { login } from '../infrastructure/login'
import {
  server,
  create,
  update,
  destroy,
  getOne,
  getAll,
} from '../requests/products'
import productsJson from '../fixtures/products.json'
import usersJson from '../fixtures/users.json'

const products = productsJson.products
const editors = usersJson.editors

const productTitle = () => {
  const title = `${faker.commerce.productAdjective()} ${faker.commerce.productName()}`
  return title
}

test('setup', async (t) => {
  t.end()
})

test('As editor I should:', (t) => {
  let token
  let editor = editors[0]

  t.test('setup', async (assert) => {
    await knex.migrate.latest()
    await knex.seed.run({ directory: 'tests/seeds' })
    token = await login(editor.email, editor.password)
    assert.end()
  })

  t.test('be able to create a product', async (assert) => {
    const product = { ...products[0] }
    delete product.id
    product.title = productTitle()
    const res = await create(product, { token, status: STATUS.Created })
    const createdProduct = res.body

    assert.equal(res.status, STATUS.Created)
    assert.equal(createdProduct.title, product.title)
    assert.ok(Number.isInteger(createdProduct.id))
    assert.end()
  })

  t.test('be able to update a product', async (assert) => {
    const productCreate = { ...products[1] }
    productCreate.title = productTitle()
    delete productCreate.id
    const productUpdate = {
      title: productTitle(),
    }

    const resCreate = await create(productCreate, {
      token,
      status: STATUS.Created,
    })
    const resProd = resCreate.body

    const res = await update(resProd.id, productUpdate, {
      token,
      status: STATUS.Ok,
    })
    const updatedProduct = res.body

    assert.equal(res.status, STATUS.Ok)
    assert.equal(updatedProduct.title, productUpdate.title)
    assert.end()
  })

  t.test(
    "NOT be able to update a product that don't exists",
    async (assert) => {
      const product = {
        title: productTitle(),
      }
      const res = await update(6456, product, {
        token,
        status: STATUS.NotFound,
      })

      assert.equal(res.status, STATUS.NotFound)
      assert.end()
    },
  )

  t.test('be able to delete a product', async (assert) => {
    const product = { ...products[2] }
    product.title = productTitle()
    delete product.id

    const resCreate = await create(product, { token, status: STATUS.Created })
    const createdProduct = resCreate.body
    const res = await destroy(createdProduct.id, { token, status: STATUS.Ok })
    const deletedProduct = await knex('products')
      .where({
        id: createdProduct.id,
      })
      .first()

    assert.equal(res.status, STATUS.Ok)
    assert.equal(deletedProduct, undefined)
    assert.end()
  })

  t.test('be able to retrieve a product', async (assert) => {
    const product = { ...products[3] }
    product.title = productTitle()
    delete product.id

    const resCreate = await create(product, { token, status: STATUS.Created })
    const createdProduct = resCreate.body
    const res = await getOne(createdProduct.id, { token, status: STATUS.Ok })
    const retrievedProduct = res.body

    assert.equal(res.status, STATUS.Ok)
    assert.equal(retrievedProduct.title, product.title, 'equal name')
    assert.end()
  })

  t.test('NOT be able to create a product that exists', async (assert) => {
    const product = { ...products[0] }
    delete product.id

    const res = await create(product, { token, status: STATUS.Conflict })

    assert.equal(res.status, STATUS.Conflict)
    assert.end()
  })

  t.test('be able to retrieve all products', async (assert) => {
    const allProducts = await knex('products')
    const res = await getAll({ token, status: STATUS.Ok })
    const resProds = res.body

    assert.equal(res.status, STATUS.Ok)
    assert.ok(Array.isArray(resProds))
    assert.equal(resProds.length, allProducts.length, 'array w/ right length')
    assert.end()
  })

  t.test('teardown', async (assert) => {
    await knex.seed.run()
    assert.end()
  })

  t.end()
})

test('teardown', async (t) => {
  await server.close()
  t.end()
})

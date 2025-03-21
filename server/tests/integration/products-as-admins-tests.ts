import path from 'path'
import { promises as fs } from 'fs';
import  test from 'tape'
import  { faker } from '@faker-js/faker'
import  knex from '../../src/db/db'
import  STATUS  from '../../src/types/status-code'
import  { login } from '../infrastructure/login'
import  { existsFile } from '../../src/helpers/fs-helper'

import productsJson from '../fixtures/products.json' with {type: 'json'}
import usersJson from '../fixtures/users.json' with {type: 'json'}
import imagesJson from '../fixtures/images.json' with {type: 'json'}

const products = productsJson.products
const admins = usersJson.admins
const images = imagesJson.images

const productTitle = () => faker.commerce.productName()

import {
  server,
  create,
  update,
  destroy,
  createAll,
  createUpload,
  updateUpload,
  getOne,
  getAll,
} from '../requests/products-request'

import StatusCode from '../../src/types/status-code'
import { Product } from '../../src/models/product';

test('setup', async (t) => {
  t.end()
})

test('As admin I should:', (t) => {
  let token: string
  let admin = admins[0]

  t.test('setup', async (assert) => {
    await knex.migrate.latest()
    await knex.seed.run({ directory: 'tests/seeds' })
    token = await login(admin.email, admin.password)
    assert.end()
  })

  t.test('be able to create a product', async (assert) => {
    const {id, ...productWithoutId} = products[0]
    productWithoutId.title = productTitle()
    const res = await create(productWithoutId, { token, status: STATUS.Created })
    const createdProduct = res.body

    assert.equal(res.status, STATUS.Created)
    assert.equal(createdProduct.title, productWithoutId.title)
    assert.ok(Number.isInteger(res.body.id))
    assert.end()
  })

  t.test('be able to create a product with image', async (assert) => {
    const product = { ...products[0] }
    product.title = productTitle()
    delete product.description
    delete product.id
    const res = await createUpload(product, images[0], {
      token,
      status: STATUS.Created,
    })

    const createdProduct = res.body

    assert.equal(res.status, STATUS.Created, 'product was created')
    assert.ok(
      createdProduct.image.endsWith(path.basename(images[0].path)),
      'right name',
    )
    assert.ok(Number.isInteger(createdProduct.id), 'has an integer id')
    const filepath = path.join(__dirname, '../data', createdProduct.image)

    const fileExists = await fs.stat(filepath)
    assert.ok(fileExists, 'file was created')

    assert.end()
  })

  t.test('be able to update a product with new image', async (assert) => {
    const product = { ...products[0] }
    product.title = productTitle()
    delete product.id
    const res = await createUpload(product, images[0], {
      token,
      status: STATUS.Created,
    })
    const createdProd = res.body

    const resUpdate = await updateUpload({id: createdProd.id, image: images[1],
      token,
      status: STATUS.Ok,
    })
    const updatedProd = resUpdate.body

    assert.equal(resUpdate.status, STATUS.Ok, 'status is right')
    assert.ok(updatedProd.image.endsWith(path.basename(images[1].path)))

    const createdImg = path.join(__dirname, '../data', `./${createdProd.image}`)
    const updatedImg = path.join(__dirname, '../data', `${updatedProd.image}`)

    assert.ok(await existsFile(updatedImg), 'new image was created')
    assert.notOk(await existsFile(createdImg), 'old image was deleted')

    assert.end()
  })

  t.test('be able to create a collection of products', async (assert) => {
    const newProducts = [{ ...products[0] }, { ...products[1] }] as Product[]
    delete newProducts[0].id
    delete newProducts[1].id
    const image0 = `${faker.system.directoryPath()}/image0.jpg`
    const image1 = `${faker.system.directoryPath()}/image1.jpg`
    const name0 = productTitle()
    newProducts[0].title = name0
    newProducts[0].image = image0
    newProducts[1].title = productTitle()
    newProducts[1].image = image1
    const res = await createAll(
      { products: newProducts },
      {
        token,
        status: STATUS.Created,
      },
    )
    const prod0 = await knex('products').where({ title: name0 }).first('*')
    const lastProduct = res.body.lastProduct

    assert.equal(res.status, STATUS.Created)
    assert.ok(
      lastProduct instanceof Object && lastProduct.constructor === Object,
    )
    assert.equal(prod0.image, image0)
    // assert.ok(Array.isArray(res.body.products))
    assert.end()
  })

  t.test(
    'NOT be able to submit a create collection of products with duplicated titles',
    async (assert) => {
      const repeatedTitle = productTitle()
      const newProducts = [{ ...products[0] }, { ...products[1] }]
      delete newProducts[0].id
      delete newProducts[1].id
      newProducts[0].title = repeatedTitle
      newProducts[1].title = repeatedTitle
      const res = await createAll(
        { products: newProducts },
        {
          token,
          status: STATUS.Unprocessable,
        },
      )

      assert.equal(res.status, STATUS.Unprocessable)
      assert.end()
    },
  )

  t.test(
    'NOT be able to create a collection of products with a product title already existing',
    async (assert) => {
      const existingProduct = await knex('products').first()
      const newProducts = [{ ...products[0] }, { ...products[1] }]
      delete newProducts[0].id
      delete newProducts[1].id
      newProducts[0].title = existingProduct.title
      newProducts[1].title = productTitle()
      const res = await createAll(
        {
          products: newProducts,
        },
        {
          token,
          status: STATUS.Conflict,
        },
      )
      assert.equal(res.status, STATUS.Conflict)
      assert.end()
    },
  )

  t.test('NOT be able to reference inexistent category', async (assert) => {
    const newProduct = { ...products[0] }
    delete newProduct.id
    newProduct.title = productTitle()
    newProduct.categoryId = 2345
    const res = await create(newProduct, {
      token,
      status: STATUS.Unprocessable,
    })

    assert.equal(res.status, STATUS.Unprocessable)
    assert.equal(res.body.error, 'categoryId references inexistent entity.')
    assert.end()
  })

  t.test('NOT be able to reference inexistent status', async (assert) => {
    const newProduct = { ...products[0] }
    delete newProduct.id
    newProduct.title = productTitle()
    newProduct.statusId = 23423
    const res = await create(newProduct, {
      token,
      status: STATUS.Unprocessable,
    })

    assert.equal(res.status, STATUS.Unprocessable)
    assert.equal(res.body.error, 'statusId references inexistent entity.')
    assert.end()
  })

  t.test('be able to update category of a product', async (assert) => {
    // Arrange
    const prod = { ...products[3] }
    delete prod.id
    prod.title = productTitle()
    const resCreate = await create(prod, { token, status: STATUS.Created })
    const createdProduct = resCreate.body

    // Act
    const updateProduct = { categoryId: 3 }
    const res = await update(createdProduct.id, updateProduct, {
      token,
      status: STATUS.Ok,
    })

    // Assert
    assert.equal(res.status, STATUS.Ok)
    assert.equal(res.body.categoryId, 3)
    assert.end()
  })

  t.test(
    'NOT be able to update product with inexestent category',
    async (assert) => {
      const newProduct = { ...products[0] }
      newProduct.title = productTitle()
      delete newProduct.id
      const res = await create(newProduct, {
        token,
        status: STATUS.Created,
      })
      const createdProd = res.body

      const updateProduct = { categoryId: 98237 }
      const resUpdate = await update(createdProd.id, updateProduct, {
        token,
        status: STATUS.Unprocessable,
      })

      assert.equal(resUpdate.status, STATUS.Unprocessable)
      assert.end()
    },
  )

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
    let resProd = resCreate.body
    const res = await update(resProd.id, productUpdate, {
      token,
      status: STATUS.Ok,
    })

    assert.equal(res.status, STATUS.Ok)
    assert.equal(res.body.title, productUpdate.title)
    assert.end()
  })

  t.test(
    "NOT be able to update a product that don't exists",
    async (assert) => {
      const product = {
        title: productTitle(),
      }
      const res = await update(564, product, {
        token,
        status: STATUS.NotFound,
      })

      assert.equal(res.status, STATUS.NotFound)
      assert.end()
    },
  )

  t.test('be able to delete a product', async (assert) => {
    const product = { ...products[2] }
    delete product.id
    product.title = productTitle()

    const resCreate = await create(product, { token, status: STATUS.Created })
    const resProd = resCreate.body
    const res = await destroy(resProd.id, {
      token,
      status: STATUS.Ok,
    })

    assert.equal(res.status, STATUS.Ok)
    assert.end()
  })

  t.test('be able to retrieve a product', async (assert) => {
    const product = { ...products[3] }
    delete product.id
    product.title = productTitle()

    const resCreate = await create(product, { token, status: STATUS.Created })
    const resProd = resCreate.body
    const res = await getOne(resProd.id, { token, status: STATUS.Ok })
    const retrievedProduct = res.body

    assert.equal(res.status, STATUS.Ok)
    assert.equal(retrievedProduct.title, product.title, 'equal name')
    assert.end()
  })

  t.test('NOT be able to create a product that exists', async (assert) => {
    const product = { ...products[0] }
    delete product.id

    const res = await create(product, {
      token,
      status: STATUS.Conflict,
    })

    assert.equal(res.status, STATUS.Conflict)
    assert.end()
  })

  t.test('be able to retrieve a draft product', async (assert) => {
    const product = products[0]
    const res = await getOne(product.id, { token, status: STATUS.Ok })

    assert.equal(res.status, STATUS.Ok)
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
  const dir = 'tests/data/uploads'
  const files = await fs.readdir(dir)
  for (const f of files) {
    await fs.unlink(path.join(dir, f))
  }
  t.end()
})

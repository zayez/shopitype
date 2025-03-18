import path from 'path'
import requestBuilder from '../helpers/request-builder'
import { POST_PRODUCT, PRODUCTS } from '../../src/api/endpoint-urls'
import { debugStatus } from '../helpers/request-helpers'
import { StatusCodeType } from '../../src/types/status-code'
const {
  agent,
  server,
  create,
  createAll,
  update,
  destroy,
  getOne,
  get,
  getAll,
} = requestBuilder(PRODUCTS)

/**
 *
 * Submits a POST with the product and upload image.
 * @param {Product} product the product
 * @param {string} image image path
 * @param {RequestOptions} opts options
 * @returns {Response} response
 */
const createUpload = async (
  { title, description, price, inventory, categoryId, statusId },
  image,
  { token, status },
) => {
  const imagepath = path.join(__dirname, `../${image.path}`)

  let post = agent
    .post(POST_PRODUCT)
    .set('Content-Type', 'multipart/form-data')
    .set('Authorization', token)
    .set('Accept', 'multipart/form-data')
    .expect('Content-Type', /json/)
    .expect((res) => debugStatus(res, status))
    .expect(status)

  post = title ? post.field('title', title) : post
  post = description ? post.field('description', description) : post
  post = inventory ? post.field('inventory', inventory) : post
  post = price ? post.field('price', price) : post
  post = categoryId ? post.field('categoryId', categoryId) : post
  post = statusId ? post.field('statusId', statusId) : post
  post.attach('image', imagepath)

  return await post.then((res) => res)
}

const updateUpload = async ({
  id,
  title,
  description,
  price,
  inventory,
  categoryId,
  statusId,
  image,
  token,
  status,
}: {
  id: number
  title?: string
  description?: string
  price?: number
  inventory?: number
  categoryId?: number
  statusId?: number
  image: any
  token: string
  status: StatusCodeType
}) => {
  const imagepath = path.join(__dirname, `../${image.path}`)

  let patch = agent
    .patch(`/products/${id}`)
    .set('Content-Type', 'multipart/form-data')
    .set('Authorization', token)
    .set('Accept', 'multipart/form-data')
    .expect('Content-Type', /json/)
    .expect((res) => debugStatus(res, status))
    .expect(status)

  patch = title ? patch.field('title', title) : patch
  patch = description ? patch.field('description', description) : patch
  patch = inventory ? patch.field('inventory', inventory) : patch
  patch = price ? patch.field('price', price) : patch
  patch = categoryId ? patch.field('categoryId', categoryId) : patch
  patch = statusId ? patch.field('statusId', statusId) : patch
  patch.attach('image', imagepath)

  return await patch.then((res) => res)
}

export {
  agent,
  server,
  create,
  createAll,
  update,
  destroy,
  getOne,
  get,
  getAll,
  createUpload,
  updateUpload,
}

import requestBuilder from '../helpers/request-builder'
const { CATEGORIES } = require('../../src/api/endpoint-urls')
const {
  server,
  agent,
  create,
  createAll,
  update,
  destroy,
  getOne,
  get,
  getAll,
} = requestBuilder(CATEGORIES)

export {
  server,
  agent,
  create,
  createAll,
  update,
  destroy,
  getOne,
  get,
  getAll,
}

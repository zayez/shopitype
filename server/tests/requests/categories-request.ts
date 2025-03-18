import requestBuilder from '../helpers/request-builder'
const { CATEGORIES } = require('../../api/endpoint-urls')
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

import requestBuilder from '../helpers/requestBuilder'
const { CATEGORIES } = require('../../api/endpointUrls')
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

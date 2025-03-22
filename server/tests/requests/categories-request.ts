import { CATEGORIES } from '../../src/api/endpoint-urls'
import requestBuilder from '../helpers/request-builder'
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

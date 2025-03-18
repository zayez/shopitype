import { USERS } from '../../src/api/endpoint-urls'
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
} = requestBuilder(USERS)

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

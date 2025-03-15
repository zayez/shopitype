import { USERS } from '../../api/endpointUrls'
import requestBuilder from '../helpers/requestBuilder'
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

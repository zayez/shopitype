import { PRODUCT_STATUSES } from '../../api/endpointUrls'
import requestBuilder from '../helpers/requestBuilder'

const { agent, server, getAll } = requestBuilder(PRODUCT_STATUSES)

export { agent, server, getAll }

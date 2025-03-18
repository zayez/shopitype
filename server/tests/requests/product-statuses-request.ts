import { PRODUCT_STATUSES } from '../../api/endpoint-urls'
import requestBuilder from '../helpers/request-builder'

const { agent, server, getAll } = requestBuilder(PRODUCT_STATUSES)

export { agent, server, getAll }

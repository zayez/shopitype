import compose from 'koa-compose'
import ProductStatusesMiddleware from './productStatusesMiddleware'

const getAll = compose([ProductStatusesMiddleware.getAll])

const ProductStatusesPipeline = { getAll }

export default ProductStatusesPipeline

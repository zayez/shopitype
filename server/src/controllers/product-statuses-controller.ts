import controllerHelper from '../helpers/controller-helper'

const controllerName = 'productStatuses'
const { getAll } = controllerHelper(controllerName)

const ProductStatusesController = {
  getAll,
}

export default ProductStatusesController

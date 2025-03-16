import path from 'path'
import controllerHelper from '../helpers/controllerHelper'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const controllerName = path.parse(__filename).name
const { getAll } = controllerHelper(controllerName)

const ProductStatusesController = {
  getAll,
}

export default ProductStatusesController

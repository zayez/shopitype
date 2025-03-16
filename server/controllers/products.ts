import path from 'path'
import controllerHelper from '../helpers/controllerHelper'
import mapper from '../helpers/propsMapperOutput'
import Product, { ProductModel } from '../models/product'
import { deleteFile } from '../helpers/fsHelper'
import ActionStatus from '../types/ActionStatus'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const controllerName = path.parse(__filename).name

const { create, destroy, getOne, getAll } = controllerHelper(controllerName)

const update = async (id, props: ProductModel = {}) => {
  try {
    if (props.image) {
      const product = await Product.findById(id)
      await deleteFile(product.image)
    }
    const updatedProduct = await Product.update(id, props)
    if (updatedProduct) {
      const payload = mapper.mapProduct(updatedProduct)
      return {
        action: ActionStatus.Ok,
        payload,
      }
    }
    return {
      action: ActionStatus.BadRequest,
      payload: null,
    }
  } catch (err) {
    throw err
  }
}

const createCollection = async (products) => {
  try {
    // lastProduct is the last item created (for now)
    const lastProduct = await Product.create(products)
    if (lastProduct) {
      return {
        action: ActionStatus.Created,
        payload: { lastProduct: mapper.mapProduct(lastProduct) },
      }
    }
    return {
      action: ActionStatus.Unprocessable,
      payload: null,
    }
  } catch (err) {
    throw err
  }
}

const getAllActive = async (pagination) => {
  try {
    const productsFound = await Product.findAllActive(pagination)
    if (productsFound) {
      return {
        action: ActionStatus.Ok,
        payload: productsFound.map(mapper.mapProduct),
      }
    }
    return {
      action: ActionStatus.NotFound,
      payload: null,
    }
  } catch (err) {
    throw err
  }
}

const getOneActive = async (id) => {
  try {
    const productFound = await Product.findOneActive(id)
    if (productFound) {
      const product = mapper.mapProduct(productFound)
      return {
        action: ActionStatus.Ok,
        payload: product,
      }
    }
    return {
      action: ActionStatus.NotFound,
      payload: null,
    }
  } catch (err) {
    throw err
  }
}

const validateItems = async (items) => {
  try {
    const values = items.map((i) => i.productId)
    const foundItems = await Product.includesAll('id', values)
    if (!foundItems) {
      return {
        action: ActionStatus.Unprocessable,
        payload: { error: 'Some of the items have not been found.' },
      }
    }
    const hasInventory = await Product.hasInventory(items)
    if (!hasInventory) {
      return {
        action: ActionStatus.Unprocessable,
        payload: {
          error: 'Insufficient inventory for some of the items ordered.',
        },
      }
    }
    return { action: ActionStatus.Ok }
  } catch (err) {
    throw err
  }
}

const ProductsController = {
  create,
  destroy,
  getOne,
  getAll,
  update,
  createCollection,
  getAllActive,
  getOneActive,
  validateItems,
}

export default ProductsController

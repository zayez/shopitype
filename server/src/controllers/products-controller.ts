import controllerHelper from '../helpers/controller-helper'
import mapper from '../helpers/props-mapper-output'
import { deleteFile } from '../helpers/fs-helper'
import { Product } from '../models/product'
import ProductRepository from '../repositories/product-repository'
import ActionStatus from '../types/action-status'
import { OrderItem } from '../models/order'

const controllerName = 'products'

const { create, destroy, getOne, getAll } = controllerHelper(controllerName)

const update = async (id: number, props: Product) => {
  try {
    if (props.image) {
      const product = await ProductRepository.findById(id)
      if (!product) {
        return {
          action: ActionStatus.BadRequest,
          payload: null,
        }
      }
      await deleteFile(product.image ?? '')
    }
    const updatedProduct = await ProductRepository.update(id, props)
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

const createCollection = async (products: Product[]) => {
  try {
    // lastProduct is the last item created (for now)
    const lastProduct = await ProductRepository.create(products)
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

const getAllActive = async ({ page }: { page?: number }) => {
  try {
    const productsFound = await ProductRepository.findAllActive(page)
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

const getOneActive = async (id: number) => {
  try {
    const productFound = await ProductRepository.findOneActive(id)
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

const validateItems = async (items: OrderItem[]) => {
  try {
    const values = items.map((i) => i.productId)
    const foundItems = await ProductRepository.includesAll('id', values)
    if (!foundItems) {
      return {
        action: ActionStatus.Unprocessable,
        payload: { error: 'Some of the items have not been found.' },
      }
    }
    const hasInventory = await ProductRepository.hasInventory(items)
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

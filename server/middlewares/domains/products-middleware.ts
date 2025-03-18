import ProductsController from '../../controllers/products-controller'
import { setResponse } from '../../helpers/middleware-helpers'
import mapper from '../../helpers/props-mapper-input'
import { isManager } from '../../helpers/user-helpers'
import ActionStatus from '../../types/action-status'

const create = async (ctx) => {
  try {
    const product = mapper.mapProduct(ctx.request.body)
    if (ctx.request.file) {
      const filename = ctx.request.file.filename
      const filepath = `uploads`
      product.image = `${filepath}/${filename}`
    }

    const { action, payload } = await ProductsController.create(product)
    setResponse(ctx, { action, payload })
  } catch (err) {
    setResponse(ctx, { action: ActionStatus.Error })
  }
}

const createCollection = async (ctx) => {
  try {
    const products = ctx.request.body.products.map(mapper.mapProduct)
    const { action, payload } = await ProductsController.createCollection(
      products,
    )
    setResponse(ctx, { action, payload })
  } catch (err) {
    setResponse(ctx, { action: ActionStatus.Error })
  }
}

const update = async (ctx) => {
  try {
    const { id } = ctx.params
    const props = mapper.mapProduct(ctx.request.body)
    const { imageRemove } = ctx.request.body
    if (imageRemove) {
      props.image = ''
    }
    if (ctx.request.file) {
      const filename = ctx.request.file.filename
      const filepath = `uploads`
      props.image = `${filepath}/${filename}`
    }
    const { action, payload } = await ProductsController.update(id, props)
    setResponse(ctx, { action, payload })
  } catch (err) {
    setResponse(ctx, { action: ActionStatus.Error })
  }
}

const destroy = async (ctx) => {
  try {
    const { id } = ctx.params
    const { action, payload } = await ProductsController.destroy(id)
    setResponse(ctx, { action, payload })
  } catch (err) {
    setResponse(ctx, { action: ActionStatus.Error })
  }
}

const get = async (ctx) => {
  try {
    const { id } = ctx.params
    const get = isManager(ctx.state.user)
      ? ProductsController.getOne
      : ProductsController.getOneActive
    const { action, payload } = await get(id)

    setResponse(ctx, { action, payload })
  } catch (err) {
    setResponse(ctx, { action: ActionStatus.Error })
  }
}

const getAll = async (ctx) => {
  try {
    const { page } = ctx.request.query
    const get = isManager(ctx.state.user)
      ? ProductsController.getAll
      : ProductsController.getAllActive
    const { action, payload } = await get({ page })
    setResponse(ctx, { action, payload })
  } catch (err) {
    setResponse(ctx, { action: ActionStatus.Error })
  }
}

const ProductsMiddleware = {
  create,
  createCollection,
  update,
  destroy,
  get,
  getAll,
}

export default ProductsMiddleware

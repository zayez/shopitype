import CategoriesController from '../../controllers/categories-controller'
import { setResponse } from '../../helpers/middleware-helpers'
import mapper from '../../helpers/props-mapper-input'
import ActionStatus from '../../types/action-status'

const create = async (ctx) => {
  try {
    const props = mapper.mapCategory(ctx.request.body)
    const { action, payload } = await CategoriesController.create(props)
    setResponse(ctx, { action, payload })
  } catch (err) {
    setResponse(ctx, { action: ActionStatus.Error })
  }
}

const update = async (ctx) => {
  try {
    const props = mapper.mapCategory(ctx.request.body)
    const { id } = ctx.params
    const { action, payload } = await CategoriesController.update(id, props)
    setResponse(ctx, { action, payload })
  } catch (err) {
    setResponse(ctx, { action: ActionStatus.Error })
  }
}

const destroy = async (ctx) => {
  try {
    const { id } = ctx.params
    const { action, payload } = await CategoriesController.destroy(id)
    setResponse(ctx, { action, payload })
  } catch (err) {
    setResponse(ctx, { action: ActionStatus.Error })
  }
}

const get = async (ctx) => {
  try {
    const { id } = ctx.params
    const { action, payload } = await CategoriesController.getOne(id)
    setResponse(ctx, { action, payload })
  } catch (err) {
    setResponse(ctx, { action: ActionStatus.Error })
  }
}

const getAll = async (ctx) => {
  try {
    const { page } = ctx.request.query
    const { action, payload } = await CategoriesController.getAll({ page })
    setResponse(ctx, { action, payload })
  } catch (err) {
    setResponse(ctx, { action: ActionStatus.Error })
  }
}

const CategoriesMiddleware = {
  create,
  update,
  destroy,
  get,
  getAll,
}

export default CategoriesMiddleware

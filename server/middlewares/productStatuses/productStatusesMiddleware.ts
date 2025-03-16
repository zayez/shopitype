import ProductStatusesController from '../../controllers/productStatuses'
import { setResponse } from '../../helpers/middlewareHelpers'
import { isManager } from '../../helpers/userHelpers'
import ActionStatus from '../../types/ActionStatus'

const getAll = async (ctx) => {
  try {
    if (!isManager(ctx.state.user)) {
      setResponse(ctx, { action: ActionStatus.Forbidden })
      return
    }
    const { action, payload } = await ProductStatusesController.getAll()
    setResponse(ctx, { action, payload })
  } catch (err) {
    setResponse(ctx, { action: ActionStatus.Error })
  }
}

const ProductStatusesMiddleware = {
  getAll,
}

export default ProductStatusesMiddleware

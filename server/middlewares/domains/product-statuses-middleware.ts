import ProductStatusesController from '../../controllers/product-statuses-controller'
import { setResponse } from '../../helpers/middleware-helpers'
import { isManager } from '../../helpers/user-helpers'
import ActionStatus from '../../types/action-status'

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

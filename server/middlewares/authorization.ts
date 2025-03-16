import { setResponse } from '../helpers/middlewareHelpers'
import User from '../models/user'
import ActionStatus from '../types/ActionStatus'

const authorizeRoles = (roles = []) => {
  return async (ctx, next) => {
    try {
      const user = ctx.state.user
      if (!user) {
        setResponse(ctx, { action: ActionStatus.Unauthorized })
        ctx.set('WWW-Authenticate', 'Bearer')
        return
      }

      if (!(await User.hasRole(user, roles))) {
        setResponse(ctx, { action: ActionStatus.Forbidden })
      }
      await next()
    } catch (err) {
      setResponse(ctx, { action: ActionStatus.Error })
    }
  }
}

const authorizeAdmin = authorizeRoles(['admin'])
const authorizeEditor = authorizeRoles(['editor'])
const authorizeCustomer = authorizeRoles(['customer'])
const authorizeManagers = authorizeRoles(['admin', 'editor'])

export {
  authorizeRoles,
  authorizeAdmin,
  authorizeEditor,
  authorizeCustomer,
  authorizeManagers,
}

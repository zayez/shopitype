import { setResponse } from '../helpers/middleware-helpers'
import UserRepository from '../repositories/user-repository'
import ActionStatus from '../types/action-status'

const authorizeRoles = (roles = []) => {
  return async (ctx, next) => {
    try {
      const user = ctx.state.user
      if (!user) {
        setResponse(ctx, { action: ActionStatus.Unauthorized })
        ctx.set('WWW-Authenticate', 'Bearer')
        return
      }

      if (!(await UserRepository.hasRole(user, roles))) {
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

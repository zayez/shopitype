import { setResponse } from '../helpers/middleware-helpers'
import UserRepository from '../repositories/user-repository'
import ActionStatus from '../types/action-status'
import Koa from 'koa'
import { RoleType } from '../types/role-type'
import { isCustomer, isManager } from '../helpers/user-helpers'
import { matchUserId } from './request-validators'

const authorizeRoles = (roles: RoleType[] = []) => {
  return async (ctx: Koa.Context, next: Koa.Next) => {
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
    } catch {
      setResponse(ctx, { action: ActionStatus.Error })
    }
  }
}

const authorizeUserAndManagers = async (ctx: Koa.Context, next: Koa.Next) => {
  const user = ctx.state.user
  if (isCustomer(user)) {
    await matchUserId()(ctx, next)
  }
  if (isManager(user)) {
    await next()
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
  authorizeUserAndManagers,
}

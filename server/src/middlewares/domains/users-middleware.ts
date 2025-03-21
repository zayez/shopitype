import ActionStatus from '../../types/action-status'
import UsersController from '../../controllers/users-controller'
import { setResponse } from '../../helpers/middleware-helpers'
import mapper from '../../helpers/props-mapper-input'
import { isManager } from '../../helpers/user-helpers'
import Koa from 'koa'
import { RoleType } from '../../types/role-type'

const create = async (ctx: Koa.Context) => {
  try {
    const user = mapper.mapUser(ctx.request.body)
    const roles = ctx.request.body.roles || ['customer']
    const { action, payload } = await UsersController.create(user, roles)

    setResponse(ctx, { action, payload })
  } catch {
    setResponse(ctx, { action: ActionStatus.Error })
  }
}

const update = async (ctx: Koa.Context) => {
  try {
    const id = ctx.state.user.id
    const user = ctx.request.body
    const { action, payload } = await UsersController.update(id, user)
    setResponse(ctx, { action, payload })
  } catch (err) {
    setResponse(ctx, { action: ActionStatus.Error })
  }
}

const destroy = async (ctx: Koa.Context) => {
  try {
    const id = ctx.state.user.id
    const { action, payload } = await UsersController.destroy(id)
    setResponse(ctx, { action, payload })
  } catch (err) {
    setResponse(ctx, { action: ActionStatus.Error })
  }
}

const get = async (ctx: Koa.Context) => {
  try {
    const user = ctx.state.user
    const id = isManager(user) ? ctx.params.id : ctx.state.user.id
    const { action, payload } = await UsersController.getOne(id)
    setResponse(ctx, { action, payload })
  } catch (err) {
    setResponse(ctx, { action: ActionStatus.Error })
  }
}

const getAll = async (ctx: Koa.Context) => {
  try {
    const queryRoles = ctx.query.roles
    const rolesStr = Array.isArray(queryRoles)
      ? queryRoles.join(',')
      : queryRoles
    const roles = rolesStr ? rolesStr.split(',') : null

    if (roles) {
      const { action, payload } = await UsersController.getAllByRoles(
        roles as RoleType[],
      )
      setResponse(ctx, { action, payload })
    } else {
      const { action, payload } = await UsersController.getAll()
      setResponse(ctx, { action, payload })
    }
  } catch (err) {
    setResponse(ctx, { action: ActionStatus.Error })
  }
}

const UsersMiddleware = {
  create,
  update,
  destroy,
  get,
  getAll,
}

export default UsersMiddleware

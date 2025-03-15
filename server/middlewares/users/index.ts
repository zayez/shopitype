import compose from 'koa-compose'
import { isValidCreate, isValidUpdate } from './usersValidation'
import { authorizeAdmin, authorizeManagers } from '../authorization'
import { userExists } from '../verify'
import UsersMiddleware from './usersMiddleware'
import { authenticate } from '../authentication'
import { matchUserId } from '../validations'
import { isValidId } from '../application/applicationValidation'
import { isCustomer, isManager } from '../../helpers/userHelpers'

const create = compose([
  authorizeAdmin,
  isValidCreate,
  userExists,
  UsersMiddleware.create,
])

const update = compose([
  authenticate,
  isValidUpdate,
  matchUserId(),
  UsersMiddleware.update,
])

const destroy = compose([
  authenticate,
  isValidId,
  matchUserId(),
  UsersMiddleware.destroy,
])

const authorizeUserAndManagers = async (ctx, next) => {
  const user = ctx.state.user
  if (isCustomer(user)) {
    await matchUserId()(ctx, next)
  }
  if (isManager(user)) {
    await next()
  }
}

const get = compose([
  authenticate,
  isValidId,
  authorizeUserAndManagers,
  UsersMiddleware.get,
])

const getAll = compose([authorizeManagers, UsersMiddleware.getAll])

const UsersPipeline = { create, update, destroy, get, getAll }

export default UsersPipeline

import Router from 'koa-router'
import {
  DELETE_USER,
  GET_USER,
  GET_USERS,
  PATCH_USER,
  POST_USER,
} from '../api/endpoint-urls'
import UsersPipeline from '../middlewares/users'
import compose from 'koa-compose'
import { authorizeAdmin, authorizeManagers } from '../middlewares/authorization'
import {
  isValidCreate,
  isValidUpdate,
} from '../middlewares/validations/users-validation'
import { userExists } from '../middlewares/resource-checks-middleware'
import UsersMiddleware from '../middlewares/domains/users-middleware'
import { authenticate } from '../middlewares/authentication'
import { matchUserId } from '../middlewares/request-validators'
import { isValidId } from '../middlewares/validations/application-validation'
import { isCustomer, isManager } from '../helpers/user-helpers'

const router = new Router()

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

router.post(POST_USER, create)
router.patch(PATCH_USER, update)
router.delete(DELETE_USER, destroy)
router.get(GET_USER, get)
router.get(GET_USERS, getAll)

export default router

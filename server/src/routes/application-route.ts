import Router from 'koa-router'
import {
  GET_ROOT,
  GET_SIGN_OUT,
  GET_USER_LOGGED,
  POST_SIGN_IN,
  POST_SIGN_UP,
} from '../api/endpoint-urls'
import compose from 'koa-compose'
import ApplicationMiddleware from '../middlewares/domains/application-middleware'
import {
  isValidSignIn,
  isValidSignUp,
} from '../middlewares/validations/application-validation'
import { authenticate, authenticateLocal } from '../middlewares/authentication'
import { userExists } from '../middlewares/resource-checks-middleware'
import Koa from 'koa'

const router = new Router<Koa.DefaultState, Koa.DefaultContext>()

const getRoot = compose([ApplicationMiddleware.getRoot])

const signIn = compose([
  isValidSignIn,
  authenticateLocal,
  ApplicationMiddleware.signIn,
])

const signUp = compose([
  isValidSignUp,
  userExists,
  ApplicationMiddleware.signUp,
])

const signOut = compose([ApplicationMiddleware.signOut])

const getUser = compose([authenticate, ApplicationMiddleware.getUser])

router.get(GET_ROOT, getRoot)
router.post(POST_SIGN_IN, signIn)
router.post(POST_SIGN_UP, signUp)
router.get(GET_SIGN_OUT, signOut)
router.get(GET_USER_LOGGED, getUser)

export default router

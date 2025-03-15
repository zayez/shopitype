import compose from 'koa-compose'
import ApplicationMiddleware from './applicationMiddleware'
import { isValidSignIn, isValidSignUp } from './applicationValidation'
import { authenticate, authenticateLocal } from '../authentication'
import { userExists } from '../verify'

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

const ApplicationPipeline = { getRoot, signIn, signUp, signOut, getUser }

export default ApplicationPipeline

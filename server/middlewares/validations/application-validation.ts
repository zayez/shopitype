import { validateBody, validateParams } from '../request-validators'
import { Id, SignIn, SignUp } from '../schemas/application-schemas'

const isValidSignUp = async (ctx, next) =>
  await validateBody({ ctx, next }, SignUp)

const isValidSignIn = async (ctx, next) =>
  await validateBody({ ctx, next }, SignIn)

const isValidId = async (ctx, next) => await validateParams({ ctx, next }, Id)

export { isValidSignIn, isValidSignUp, isValidId }

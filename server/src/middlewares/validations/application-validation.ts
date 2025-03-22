import { validateBody, validateParams } from '../request-validators'
import { Id, SignIn, SignUp } from '../schemas/application-schemas'
import Koa from 'koa'

const isValidSignUp = async (ctx: Koa.Context, next: Koa.Next) =>
  await validateBody({ ctx, next }, SignUp)

const isValidSignIn = async (ctx: Koa.Context, next: Koa.Next) =>
  await validateBody({ ctx, next }, SignIn)

const isValidId = async (ctx: Koa.Context, next: Koa.Next) =>
  await validateParams({ ctx, next }, Id)

export { isValidSignIn, isValidSignUp, isValidId }

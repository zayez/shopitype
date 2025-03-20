import { validateBody } from '../request-validators'
import { Create, Update } from '../schemas/users-schemas'
import Koa from 'koa'

const isValidCreate = async (ctx: Koa.Context, next: Koa.Next) =>
  await validateBody({ ctx, next }, Create)
const isValidUpdate = async (ctx: Koa.Context, next: Koa.Next) =>
  await validateBody({ ctx, next }, Update)

export { isValidCreate, isValidUpdate }

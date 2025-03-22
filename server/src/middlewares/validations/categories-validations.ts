import { validateBody, validateQuery } from '../request-validators'
import { Create, Update, GetAll } from '../schemas/categories-schemas'
import Koa from 'koa'

const isValidCreate = async (ctx: Koa.Context, next: Koa.Next) =>
  await validateBody({ ctx, next }, Create)

const isValidUpdate = async (ctx: Koa.Context, next: Koa.Next) =>
  await validateBody({ ctx, next }, Update)

const isValidGetAll = async (ctx: Koa.Context, next: Koa.Next) =>
  await validateQuery({ ctx, next }, GetAll)

export { isValidCreate, isValidUpdate, isValidGetAll }

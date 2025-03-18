import { validateBody, validateQuery } from '../request-validators'
import { Create, Update, GetAll } from '../schemas/categories-schemas'

const isValidCreate = async (ctx, next) =>
  await validateBody({ ctx, next }, Create)

const isValidUpdate = async (ctx, next) =>
  await validateBody({ ctx, next }, Update)

const isValidGetAll = async (ctx, next) =>
  await validateQuery({ ctx, next }, GetAll)

export { isValidCreate, isValidUpdate, isValidGetAll }

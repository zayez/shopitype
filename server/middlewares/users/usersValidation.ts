import { validateBody } from '../validations'
import { Create, Update } from './usersSchemas'

const isValidCreate = async (ctx, next) =>
  await validateBody({ ctx, next }, Create)
const isValidUpdate = async (ctx, next) =>
  await validateBody({ ctx, next }, Update)

export { isValidCreate, isValidUpdate }

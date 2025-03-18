import { validateBody } from '../request-validators'
import { Create, Update } from '../schemas/users-schemas'

const isValidCreate = async (ctx, next) =>
  await validateBody({ ctx, next }, Create)
const isValidUpdate = async (ctx, next) =>
  await validateBody({ ctx, next }, Update)

export { isValidCreate, isValidUpdate }

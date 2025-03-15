import queryBuilder from '../lib/queryBuilder'
import { CategoryModel } from './category'
import { ProductModel } from './product'
import { ProductStatusModel } from './productStatus'
import { UserModel } from './user'

export interface Entity {
  entity?: UserModel | CategoryModel | ProductModel | ProductStatusModel
}

export default function entity(
  tableName: string,
  selectableFields: string = '*',
) {
  const {
    find,
    findAll,
    findOne,
    findById,
    create,
    update,
    destroy,
    destroyAll,
    includesAny,
  } = queryBuilder(tableName, selectableFields)

  return {
    find,
    findAll,
    findOne,
    findById,
    create,
    update,
    destroy,
    destroyAll,
    includesAny,
  }
}

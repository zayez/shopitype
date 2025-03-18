import queryBuilder from '../lib/query-builder/query-builder'

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

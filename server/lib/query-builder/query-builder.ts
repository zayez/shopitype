/*
This is modified work. Original is from here:
https://github.com/robmclarty/cred-server/blob/main/server/helpers/query_helper.js

*/

import knex from '../../db'
// import '../../models';
import { app } from '../../config/config'

const { ITEMS_PER_PAGE } = app

export interface PaginationOptions {
  page?: number
  perPage?: number
}

export interface QueryBuilder<T> {
  find: (filters: Partial<T>, opts?: PaginationOptions) => Promise<T[]>
  findAll: (paginationOpts?: PaginationOptions) => Promise<T[]>
  findOne: (filters: Partial<T>) => Promise<T | undefined>
  findById: (id: number) => Promise<T | undefined>
  create: (entity: T | T[]) => Promise<T | undefined>
  update: (id: number, props: Partial<T>) => Promise<T | undefined>
  destroy: (id: number) => Promise<number>
  destroyAll: (filters?: Partial<T>) => Promise<number>
  includesAny: (field: keyof T, values: any[]) => Promise<boolean>
}

export default function queryBuilder<T = any>(
  tableName: string,
  selectableFields: string | string[] = '*',
): QueryBuilder<T> {
  /**
   * Finds with filters.
   */
  const find = async (
    filters: Partial<T>,
    { page = 1, perPage = ITEMS_PER_PAGE }: PaginationOptions = {},
  ): Promise<any[]> => {
    const items = await knex
      .select(selectableFields)
      .from(tableName)
      .where(filters)
      // Assuming you have a pagination plugin for knex.
      .paginate({ perPage: perPage, currentPage: page })

    return items.data
  }

  /**
   * Finds all.
   */
  const findAll = async (pagination: PaginationOptions = {}): Promise<T[]> => {
    return await find({}, pagination)
  }

  /**
   * Finds first match.
   */
  const findOne = async (filters: Partial<T>): Promise<T | undefined> => {
    return await knex.first(selectableFields).from(tableName).where(filters)
  }

  /**
   * Finds item by ID.
   */
  const findById = async (id: number): Promise<T | undefined> => {
    return await knex(tableName).first(selectableFields).where({ id })
  }

  /**
   * Inserts entity.
   */
  const create = async (entity: T | T[]): Promise<T | undefined> => {
    // Note: knex.insert typically returns an array of inserted ids.
    const id = await knex(tableName).insert(entity)
    return await findById(id[0])
  }

  /**
   * Updates item.
   */
  const update = async (
    id: number,
    props: Partial<T>,
  ): Promise<T | undefined> => {
    await knex(tableName).update(props).where({ id })
    return await findById(id)
  }

  /**
   * Destroys item.
   */
  const destroy = async (id: number): Promise<number> => {
    return await knex(tableName).del().where({ id })
  }

  /**
   * Destroys all items.
   */
  const destroyAll = async (filters?: Partial<T>): Promise<number> => {
    return filters
      ? await knex(tableName).del().where(filters)
      : await knex(tableName).del()
  }

  /**
   * Check if table includes a row with any of the values in the specified field.
   */
  const includesAny = async (
    field: keyof T,
    values: any[],
  ): Promise<boolean> => {
    const items = await knex(tableName).select('id').whereIn(field, values)
    return items.length > 0
  }

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

import { PaginationOptions } from '../lib/query-builder/query-builder'

export interface Repository<T, CreateParams = T> {
  tableName: string
  fields: string[]
  find: (where?: Partial<T>) => Promise<T[]>
  findAll: (paginationOpts?: PaginationOptions) => Promise<T[]>
  findOne: (where?: Partial<T>) => Promise<T | null | undefined>
  findById: (id: number) => Promise<T | null | undefined>
  create: (data: CreateParams) => Promise<T | undefined>
  update: (id: number, data: Partial<T>) => Promise<T | undefined>
  destroy: (id: number) => Promise<number>
  destroyAll: () => Promise<number>
  includesAny: (field: keyof T, values: string[]) => Promise<boolean>
}

export interface MinimalRepository<T> {
  findById: (id: number) => Promise<T | null>
  findAll: (paginationOpts?: PaginationOptions) => Promise<T[]>
}

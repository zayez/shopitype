export interface Repository<T, CreateParams = T> {
  tableName: string
  fields: string[]
  find: (where?: Partial<T>) => Promise<T[]>
  findAll: (options?: any) => Promise<T[]>
  findOne: (where?: Partial<T>) => Promise<T | null>
  findById: (id: number) => Promise<T | null>
  create: (data: CreateParams) => Promise<T>
  update: (id: number, data: Partial<T>) => Promise<T>
  destroy: (id: number) => Promise<number>
  destroyAll: () => Promise<number>
  includesAny: (field: string, values: string[]) => Promise<boolean>
  [key: string]: any
}

export interface MinimalRepository<T> {
  findById: (id: number) => Promise<T | null>
  findAll: (options?: any) => Promise<T[]>
}

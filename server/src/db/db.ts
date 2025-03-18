import knexConstructor, { type Knex } from 'knex'

import configFile from '../knexfile'
import { attachPaginate } from 'knex-paginate'

const environment: string = process.env.NODE_ENV || 'development'
const config: Knex.Config = configFile[environment]
const knex: Knex = knexConstructor(config)

if (typeof knex.queryBuilder().paginate !== 'function') {
  attachPaginate()
}

export default knex

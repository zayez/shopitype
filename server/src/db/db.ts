import knexConstructor, { type Knex } from 'knex'

import configFile from '../knexfile'
import { attachPaginate } from 'knex-paginate'

type Environment = 'development' | 'test' | 'production'

const environment: Environment =
  (process.env.NODE_ENV as Environment) || 'development'
const config: Knex.Config = configFile[environment]
const knex: Knex = knexConstructor(config)

if (typeof knex.queryBuilder().paginate !== 'function') {
  attachPaginate()
}

export default knex

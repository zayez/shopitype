import path from 'path'
import dotenv from 'dotenv'
dotenv.config()

import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const dbName: string = 'storefly-db'
const dbDev: string = path.join(__dirname, '../data', `${dbName}-dev.db`)
const dbTest: string = path.join(__dirname, '../data', `${dbName}-test.db`)

const BASE_PATH: string = path.join(__dirname, 'db')

interface KnexConfig {
  client: string
  debug?: boolean
  useNullAsDefault: boolean
  connection: {
    filename?: string
    timezone: string
    host?: string
    port?: string
    database?: string
    user?: string
    password?: string
  }
  pool?: {
    min: number
    max: number
    idleTimeoutMillis?: number
  }
  migrations?: {
    directory: string
    extension: string
  }
  seeds?: {
    directory: string
  }
}

interface KnexConfigs {
  test: KnexConfig
  development: KnexConfig
  production: KnexConfig
}

const config: KnexConfigs = {
  test: {
    client: 'sqlite3',
    debug: false,
    useNullAsDefault: true,
    connection: {
      filename: dbTest,
      timezone: 'UTC',
    },
    pool: { min: 0, max: 10, idleTimeoutMillis: 500 },
    migrations: {
      directory: path.join(BASE_PATH, 'migrations'),
      extension: 'ts',
    },
    seeds: {
      directory: path.join(BASE_PATH, 'seeds'),
    },
  },
  development: {
    client: 'sqlite3',
    useNullAsDefault: true,
    connection: {
      filename: dbDev,
      timezone: 'UTC',
    },
    migrations: {
      directory: path.join(BASE_PATH, 'migrations'),
      extension: 'ts',
    },
    seeds: {
      directory: path.join(BASE_PATH, 'seeds'),
    },
  },
  production: {
    client: 'pg',
    useNullAsDefault: true,
    connection: {
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || '4002',
      database: process.env.DB_NAME || dbName,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASS || 'root',
      timezone: 'UTC',
    },
  },
}

export default config

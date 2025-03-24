import path from 'path'
import fs from 'fs'
import dotenv from 'dotenv'

const env = process.env.NODE_ENV

const envPath = path.resolve(process.cwd(), `.env.${env}`)
const defaultEnvPath = path.resolve(process.cwd(), '.env')

dotenv.config({
  path: fs.existsSync(envPath) ? envPath : defaultEnvPath,
})

const {
  CLIENT_URL,
  APP_PORT,
  APP_ITEMS_PER_PAGE,
  APP_COLLECTIONS_MIN_SIZE,
  APP_COLLECTIONS_MAX_SIZE,
  APP_IMAGE_MAX_SIZE_MB,
} = process.env
const { DB_HOST, DB_USER, DB_PASS, DB_PORT, DB_NAME } = process.env
const { JWT_SECRET, JWT_EXPIRES_IN } = process.env
const { STRIPE_KEY, STRIPE_CLI_KEY } = process.env

interface AppConfig {
  PORT: number
  ITEMS_PER_PAGE: number
  COLLECTIONS_MIN_SIZE: number
  COLLECTIONS_MAX_SIZE: number
  IMAGE_MAX_SIZE_MB: number
}

interface DBConfig {
  host: string
  port: number
  name: string
  user: string
  password: string
}

interface JWTConfig {
  SECRET: string
  TOKEN_EXPIRES_IN: string
}

interface StripeConfig {
  KEY: string
  CLI_KEY: string
}

interface Config {
  isDev: boolean
  isProd: boolean
  CLIENT_URL: string
  app: AppConfig
  db: DBConfig
  jwt: JWTConfig
  stripe: StripeConfig
}

const app = {
  PORT: Number(APP_PORT) || 3333,
  ITEMS_PER_PAGE: Number(APP_ITEMS_PER_PAGE) || 25,
  COLLECTIONS_MIN_SIZE: Number(APP_COLLECTIONS_MIN_SIZE) || 1,
  COLLECTIONS_MAX_SIZE: Number(APP_COLLECTIONS_MAX_SIZE) || 50,
  IMAGE_MAX_SIZE_MB: Number(APP_IMAGE_MAX_SIZE_MB) || 2,
}

const db = {
  host: DB_HOST || 'localhost',
  port: parseInt(DB_PORT as string) || 22222,
  name: DB_NAME || 'shopitype-db',
  user: DB_USER || 'root',
  password: DB_PASS || 'root',
}

const jwt = {
  SECRET: JWT_SECRET || 'shopitype-secret',
  TOKEN_EXPIRES_IN: JWT_EXPIRES_IN || '10min',
}

const stripe = {
  KEY: STRIPE_KEY ?? '',
  CLI_KEY: STRIPE_CLI_KEY ?? '',
}

const config: Config = {
  isDev: env === 'dev' || env === 'development',
  isProd: env === 'production' || env === 'prod',
  CLIENT_URL: CLIENT_URL ?? '',
  app,
  db,
  jwt,
  stripe,
}

export default config

export { app, db, jwt, stripe }

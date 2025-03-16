import fs from 'fs'
import Koa from 'koa'
import cors from '@koa/cors'
import serve from 'koa-static'
import mount from 'koa-mount'
import { bodyParser } from '@koa/bodyparser'
import morgan from 'koa-morgan'
import passport from 'koa-passport'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

import indexRoutes from './routes/index'
import usersRoutes from './routes/users'
import categoriesRoutes from './routes/categories'
import productsRoutes from './routes/products'
import productStatusesRoutes from './routes/productStatuses'
import ordersRoutes from './routes/orders'
import stripeCheckoutRoutes from './routes/stripeCheckout'
import stripeWebhookRoutes from './routes/stripeWebhook'
import passportConfig from './config/passportConfig'
import { authenticateOptional } from './middlewares/authentication'

import config from './config'

const { isProd, isDev } = config
const { PORT } = config.app
const uploads =
  isProd || isDev ? serve('public/uploads') : serve('tests/data/uploads')

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const accessLogStream = fs.createWriteStream(__dirname + '/access.log', {
  flags: 'a',
})

const corsOpts = {
  // origin: '*',
  credentials: true,
}

const app = new Koa()
app
  .use(morgan('combined', { stream: accessLogStream }))
  .use(mount('/uploads', uploads))
  .use(bodyParser())
  // .use(koaBody({ multipart: true }))
  .use(cors(corsOpts))
  .use(passport.initialize())

passportConfig(passport)

app
  .use(authenticateOptional)
  .use(indexRoutes.routes())
  .use(usersRoutes.routes())
  .use(categoriesRoutes.routes())
  .use(productsRoutes.routes())
  .use(productStatusesRoutes.routes())
  .use(ordersRoutes.routes())
  .use(stripeCheckoutRoutes.routes())
  .use(stripeWebhookRoutes.routes())

const server = app.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}`)
})

export default server

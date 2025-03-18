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

import applicationRoutes from './routes/application-route'
import usersRoutes from './routes/users-route'
import categoriesRoutes from './routes/categories-route'
import productsRoutes from './routes/products-route'
import productStatusesRoutes from './routes/product-statuses-route'
import ordersRoutes from './routes/orders-route'
import stripeCheckoutRoutes from './routes/stripe-checkout-route'
import stripeWebhookRoutes from './routes/stripe-webhook-route'
import passportConfig from './config/passport-config'
import { authenticateOptional } from './middlewares/authentication'

import config from './config/config'

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
  credentials: true,
}

const app = new Koa()
app
  .use(morgan('combined', { stream: accessLogStream }))
  .use(mount('/uploads', uploads))
  .use(bodyParser())
  .use(cors(corsOpts))
  .use(passport.initialize())

passportConfig(passport)

app
  .use(authenticateOptional)
  .use(applicationRoutes.routes())
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

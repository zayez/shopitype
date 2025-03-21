import { GetRootPayload } from '../controllers/application-controller'
import { ProductCollectionPayload } from '../controllers/products-controller'
import { StripeCheckoutCreatePayload } from '../middlewares/domains/stripe-checkout-middleware'
import { Category } from '../models/category'
import { Product } from '../models/product'
import { ProductStatus } from '../models/product-status'
import { User } from '../models/user'
import ActionStatus, { ActionStatusType } from '../types/action-status'
import StatusCode from '../types/status-code'
import Koa from 'koa'

const SuccessStatuses = [ActionStatus.Ok, ActionStatus.Created]
const STATUS = StatusCode

export interface UserPayload {
  user: Partial<User>
  token: string
}

interface ResponseOptions {
  action: ActionStatusType
  payload?:
    | Category
    | Category[]
    | Product
    | Product[]
    | ProductStatus
    | ProductStatus[]
    | User
    | User[]
    | GetRootPayload
    | UserPayload
    | ProductCollectionPayload
    | StripeCheckoutCreatePayload
    | number
    | null
    | undefined
}

/**
 * Sets the response based on the action with the payload.
 */
function setResponse(ctx: Koa.Context, { action, payload }: ResponseOptions) {
  if (SuccessStatuses.some((status) => status === action)) {
    const status = getResponse(action)
    ctx.response.status = status
    ctx.response.body = payload
  } else {
    const { status, title, detail } = getResponseError(action)
    ctx.response.status = status
    ctx.response.body = { status, title, detail }
    if (payload)
      ctx.response.body = {
        ...(ctx.response.body as object),
        ...(payload as object),
      }
  }
  const contentType = getContentType(action)
  ctx.set('Content-Type', contentType)
}

function getContentType(action: ActionStatusType) {
  const type =
    action === ActionStatus.Unprocessable
      ? 'application/problem+json'
      : 'application/json'
  return type
}

function getResponse(action: ActionStatusType) {
  switch (action) {
    case ActionStatus.Ok:
      return STATUS.Ok
    case ActionStatus.Created:
      return STATUS.Created
    default:
      return STATUS.Ok
  }
}

function getResponseError(action: ActionStatusType) {
  let status, title, detail
  switch (action) {
    case ActionStatus.BadRequest:
      status = STATUS.BadRequest
      title = 'Bad Request'
      detail =
        'The server could not understand the request due to invalid syntax.'
      break
    case ActionStatus.Unauthorized:
      status = STATUS.Unauthorized
      title = 'Unauthorized'
      detail =
        'The request lacks valid authentication credentials for the requested resource.'
      break
    case ActionStatus.Forbidden:
      status = STATUS.Forbidden
      title = 'Forbidden'
      detail = 'The client does not have access rights to the content.'
      break

    case ActionStatus.Conflict:
      status = STATUS.Conflict
      title = 'Conflict'
      detail = 'The request conflicts with the current state of the server.'
      break
    case ActionStatus.Unprocessable:
      status = STATUS.Unprocessable
      title = 'Unprocessable'
      detail = 'The request was unable to process the contained entity.'
      break
    case ActionStatus.Error:
      status = STATUS.Error
      title = 'Internal server error'
      detail = 'A fatal error occured.'
      break
    case ActionStatus.CreateError:
      status = STATUS.BadRequest
      title = 'Create - failed to create'
      detail = 'The server was unable to insert the data.'
      break
    default:
      status = STATUS.NotFound
      title = 'Not Found'
      detail = 'The server can not find the requested resource.'
      break
  }

  return { status, title, detail }
}

export { setResponse }

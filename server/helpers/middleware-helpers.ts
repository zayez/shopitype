import ActionStatus, { ActionStatusType } from '../types/action-status'
import StatusCode from '../types/status-code'

const SuccessStatuses = [ActionStatus.Ok, ActionStatus.Created]
const STATUS = StatusCode

interface ResponseOptions {
  action: ActionStatusType
  payload?: any
}

/**
 * Sets the response based on the action with the payload.
 * @param {Koa.ParameterizedContext} ctx context
 * @param {Object} obj
 * @param {ActionStatus} obj.action action type
 * @param {Object} obj.payload payload
 */
function setResponse(ctx, { action, payload }: ResponseOptions) {
  if (SuccessStatuses.includes(action)) {
    const status = getResponse(action)
    ctx.response.status = status
    ctx.response.body = payload
  } else {
    const { status, title, detail } = getResponseError(action)
    ctx.response.status = status
    ctx.response.body = { status, title, detail }
    if (payload) ctx.response.body = { ...ctx.response.body, ...payload }
  }
  const contentType = getContentType(action)
  ctx.set('Content-Type', contentType)
}

function getContentType(action) {
  const type =
    action === ActionStatus.Unprocessable
      ? 'application/problem+json'
      : 'application/json'
  return type
}

function getResponse(action) {
  switch (action) {
    case ActionStatus.Ok:
      return STATUS.Ok
    case ActionStatus.Created:
      return STATUS.Created
    default:
      return STATUS.Ok
  }
}

function getResponseError(action) {
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

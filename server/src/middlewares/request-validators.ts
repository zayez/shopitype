import { setResponse } from '../helpers/middleware-helpers'
import { formatValidations } from '../helpers/response-helpers'
import { modelMap } from '../utils/model-utils'
import ActionStatus from '../types/action-status'

const optsJoi = {
  abortEarly: false,
  errors: {
    wrap: {
      label: '',
    },
  },
}

async function validateBody({ ctx, next }, schema) {
  try {
    const result = schema.validate(ctx.request.body, optsJoi)
    if (result.error) {
      setResponse(ctx, {
        action: ActionStatus.Unprocessable,
        payload: formatValidations(result.error.details),
      })
      return
    }
    ctx.request.body = result.value
    return await next()
  } catch (err) {
    ctx.throw(400, err.message)
  }
}

async function validateQuery({ ctx, next }, schema) {
  try {
    const result = schema.validate(ctx.request.query, optsJoi)
    if (result.error) {
      setResponse(ctx, {
        action: ActionStatus.Unprocessable,
        payload: formatValidations(result.error.details),
      })
      return
    }

    ctx.request.body = result.value
    return await next()
  } catch (err) {
    ctx.throw(400, err.message)
  }
}

async function validateParams({ ctx, next }, schema) {
  try {
    const result = schema.validate(ctx.params, optsJoi)
    if (result.error) {
      setResponse(ctx, {
        action: ActionStatus.Unprocessable,
        payload: formatValidations(result.error.details),
      })
      return
    }

    ctx.request.body = result.value
    return await next()
  } catch (err) {
    ctx.throw(400, err.message)
  }
}

async function validateFile({ ctx, next }, schema) {
  try {
    const result = schema.validate(ctx.request.file, optsJoi)
    if (result.error) {
      setResponse(ctx, {
        action: ActionStatus.Unprocessable,
        payload: formatValidations(result.error.details),
      })
      return
    }

    ctx.request.file = result.value
    return await next()
  } catch (err) {
    ctx.throw(400, err.message)
  }
}

function isValidBody({ ctx }, schema) {
  try {
    const result = schema.validate(ctx.request.body, optsJoi)
    if (result.error) {
      return {
        type: ActionStatus.Unprocessable,
        payload: formatValidations(result.error.details),
      }
    }

    return { type: ActionStatus.Ok, payload: result.value }
  } catch (err) {
    ctx.throw(400, err.message)
  }
}

function isValidReference(column, tableName) {
  const Model = modelMap[tableName]
  return async function (ctx, next) {
    try {
      const id = ctx.request.body[column]
      if (!id) {
        return {
          type: ActionStatus.Ok,
        }
      }
      const foundReference = await Model.findById(id)

      if (!foundReference) {
        return {
          type: ActionStatus.Unprocessable,
          payload: { error: `${column} references inexistent entity.` },
        }
      }
      return {
        type: ActionStatus.Ok,
      }
    } catch (err) {
      setResponse(ctx, { action: ActionStatus.Error })
    }
  }
}

function isUnique(attr, entity) {
  const Entity = modelMap[entity]
  return async function (ctx) {
    try {
      const payload = {}
      payload[attr] = ctx.request.body[attr]
      const entityFound = await Entity.findOne(payload)

      if (entityFound) {
        return { type: ActionStatus.Conflict, payload: undefined }
      }
      return {
        type: ActionStatus.Ok,
        payload: undefined,
      }
    } catch (err) {
      setResponse(ctx, { action: ActionStatus.Error })
    }
  }
}

function itExists(entity) {
  const Entity = modelMap[entity]
  return async function (ctx) {
    try {
      const { id } = ctx.params
      const foundEntity = await Entity.findById(id)

      if (foundEntity) {
        return { type: ActionStatus.Ok, payload: foundEntity }
      }
      return { type: ActionStatus.NotFound }
    } catch (err) {
      setResponse(ctx, { action: ActionStatus.Error })
    }
  }
}

const matchUserId = (param = 'id') => {
  return async (ctx, next) => {
    const value = ctx.params[param]
    if (Number(value) !== ctx.state.user.id) {
      setResponse(ctx, { action: ActionStatus.NotFound })
      return
    }
    await next()
  }
}

export {
  validateBody,
  validateQuery,
  validateParams,
  validateFile,
  isValidBody,
  isValidReference,
  isUnique,
  itExists,
  matchUserId,
}

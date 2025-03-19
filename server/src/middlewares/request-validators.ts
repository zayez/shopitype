import { setResponse } from '../helpers/middleware-helpers'
import { formatValidations } from '../helpers/response-helpers'
import { modelMap } from '../utils/model-utils'
import ActionStatus from '../types/action-status'
import Koa from 'koa'
import { File } from '@koa/multer'

import { Schema } from 'joi'
import { ModelType } from '../models/entity'
import { Repository } from '../repositories/repository'
import { Category } from '../models/category'
import { Product } from '../models/product'
import { User } from '../models/user'
import { EntityEnum } from '../types/entity-type'

const optsJoi = {
  abortEarly: false,
  errors: {
    wrap: {
      label: '',
    },
  },
}

async function validateBody(
  { ctx, next }: { ctx: Koa.Context; next: Koa.Next },
  schema: Schema,
) {
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
    if (err instanceof Error) {
      ctx.throw(400, err.message)
    } else {
      ctx.throw(400, 'Unknown error')
    }
  }
}

async function validateQuery(
  { ctx, next }: { ctx: Koa.Context; next: Koa.Next },
  schema: Schema,
) {
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
    if (err instanceof Error) {
      ctx.throw(400, err.message)
    } else {
      ctx.throw(400, 'Unknown error')
    }
  }
}

async function validateParams(
  { ctx, next }: { ctx: Koa.Context; next: Koa.Next },
  schema: Schema,
) {
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
    if (err instanceof Error) {
      ctx.throw(400, err.message)
    } else {
      ctx.throw(400, 'Unknown error')
    }
  }
}

interface RequestWithFile extends Koa.Request {
  file: File
}

async function validateFile(
  {
    ctx,
    next,
  }: { ctx: Koa.Context & { request: RequestWithFile }; next: Koa.Next },
  schema: Schema,
) {
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
    if (err instanceof Error) {
      ctx.throw(400, err.message)
    } else {
      ctx.throw(400, 'Unknown error')
    }
  }
}

function isValidBody({ ctx }: { ctx: Koa.Context }, schema: Schema) {
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
    if (err instanceof Error) {
      ctx.throw(400, err.message)
    } else {
      ctx.throw(400, 'Unknown error')
    }
  }
}

function isValidReference(column: string, tableName: ModelType) {
  const Model = modelMap[tableName]
  return async function (ctx: Koa.Context) {
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

function isUnique(attr: string, entity: ModelType) {
  const Model = modelMap[entity]
  return async function (ctx: Koa.Context) {
    try {
      if (entity === EntityEnum.ProductStatus) {
        throw new Error(`Create operation is not supported for ${entity}`)
      }
      const payload: Record<string, unknown> = {}
      payload[attr] = ctx.request.body[attr]
      const findableModel = Model as Repository<Category | Product | User>
      const entityFound = await findableModel.findOne(payload)

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

function itExists(entity: ModelType) {
  const Entity = modelMap[entity]
  return async function (ctx: Koa.Context) {
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
  return async (ctx: Koa.Context, next: Koa.Next) => {
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

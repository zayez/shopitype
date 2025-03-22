import { setResponse } from '../helpers/middleware-helpers'
import UserRepository from '../repositories/user-repository'
import ActionStatus from '../types/action-status'
import { modelMap } from '../utils/model-utils'
import pluralize from 'pluralize'
import Koa from 'koa'
import { ModelType } from '../models/entity'
import { Repository } from '../repositories/repository'
import { Category } from '../models/category'
import { Product } from '../models/product'
import { User } from '../models/user'
import { EntityEnum } from '../types/entity-type'

async function userExists(ctx: Koa.Context, next: Koa.Next) {
  try {
    const { email } = ctx.request.body
    const foundUser = await UserRepository.findOne({ email })

    if (foundUser) {
      setResponse(ctx, { action: ActionStatus.Conflict })
      return
    }

    await next()
  } catch {
    setResponse(ctx, { action: ActionStatus.Error })
  }
}

function entityExists(entity: ModelType) {
  const Entity = modelMap[entity]
  return async function (ctx: Koa.Context, next: Koa.Next) {
    try {
      const { id } = ctx.params
      const foundEntity = await Entity.findById(id)

      if (!foundEntity) {
        setResponse(ctx, { action: ActionStatus.NotFound })
        return
      }

      await next()
    } catch {
      setResponse(ctx, { action: ActionStatus.Error })
    }
  }
}

export interface ReferenceExistsPayload {
  error: string
}

function referenceExists(column: string, tableName: ModelType) {
  const Model = modelMap[tableName]
  return async function (ctx: Koa.Context, next: Koa.Next) {
    try {
      const id = ctx.request.body[column]
      if (!id) {
        await next()
        return
      }
      const foundReference = await Model.findById(id)

      if (!foundReference) {
        setResponse(ctx, {
          action: ActionStatus.Unprocessable,
          payload: { error: `${column} references inexistent entity.` },
        })
        return
      }

      await next()
    } catch {
      setResponse(ctx, { action: ActionStatus.Error })
    }
  }
}

function disallowDuplicate(entity: ModelType, attr: string) {
  const Model = modelMap[entity]
  return async function (ctx: Koa.Context, next: Koa.Next) {
    try {
      if (entity === EntityEnum.ProductStatus) {
        throw new Error(`Find operation is not supported for ${entity}`)
      }
      const payload: Record<string, unknown> = {}
      payload[attr] = ctx.request.body[attr]
      const findableModel = Model as Repository<Category | Product | User>
      const duplicated = await findableModel.findOne(payload)

      if (duplicated) {
        setResponse(ctx, { action: ActionStatus.Conflict })
        return
      }

      await next()
    } catch {
      setResponse(ctx, { action: ActionStatus.Error })
    }
  }
}
/**
 * Check if any item in the collection already exists.
 * In the case there is one, it will set the status code to conflict.
 */
function disallowDuplicates(entity: ModelType, attr: string) {
  const Model = modelMap[entity]
  return async function (ctx: Koa.Context, next: Koa.Next) {
    try {
      if (entity === EntityEnum.ProductStatus) {
        throw new Error(`Search operation is not supported for ${entity}`)
      }
      const payload = ctx.request.body[pluralize.plural(entity)] as Array<
        Record<string, string>
      >

      const values = payload.map((p) => p[attr])
      const searchableModel = Model as Repository<Category | Product | User>

      if (await searchableModel.includesAny(attr, values)) {
        setResponse(ctx, { action: ActionStatus.Conflict })
        return
      }

      await next()
    } catch {
      setResponse(ctx, { action: ActionStatus.Error })
    }
  }
}

export {
  userExists,
  entityExists,
  referenceExists,
  disallowDuplicate,
  disallowDuplicates,
}

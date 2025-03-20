import { deleteFile } from '../../helpers/fs-helper'
import { setResponse } from '../../helpers/middleware-helpers'
import ActionStatus from '../../types/action-status'
import {
  isUnique,
  isValidBody,
  isValidReference,
  itExists,
  validateBody,
  validateFile,
  validateQuery,
} from '../request-validators'
import {
  Create,
  UploadImage,
  CreateCollection,
  Update,
  GetAll,
} from '../schemas/products-schemas'
import Koa from 'koa'

const isValidCreate = async (ctx: Koa.Context, next: Koa.Next) =>
  isValidBody({ ctx }, Create)
const isValidUpdate = async (ctx: Koa.Context, _: Koa.Next) =>
  isValidBody({ ctx }, Update)
const validateCreate = async (ctx: Koa.Context, next: Koa.Next) => {
  try {
    const validators = [
      isValidCreate,
      isValidReference('categoryId', 'category'),
      isValidReference('statusId', 'productstatus'),
      isUnique('title', 'product'),
    ]
    for (const validator of validators) {
      const action = await validator(ctx, next)
      if (!action) {
        setResponse(ctx, { action: ActionStatus.Error, payload: null })
        return
      }
      if (action.type !== ActionStatus.Ok) {
        if (ctx.request.file) {
          await deleteFile(ctx.request.file.path)
        }
        setResponse(ctx, { action: action.type, payload: action.payload })
        return
      }
    }
    await next()
  } catch (err) {
    setResponse(ctx, { action: ActionStatus.Error })
  }
}

const validateUpdate = async (ctx: Koa.Context, next: Koa.Next) => {
  try {
    const validators = [
      isValidUpdate,
      isValidReference('categoryId', 'category'),
      isValidReference('statusId', 'productstatus'),
      // isUnique('title', 'products'), // TODO: Have to fix this (on update it should skip current prod.)
      itExists('product'),
    ]
    for (let validator of validators) {
      const action = await validator(ctx, next)
      if (!action) {
        setResponse(ctx, { action: ActionStatus.Error, payload: null })
        return
      }
      if (action.type !== ActionStatus.Ok) {
        if (ctx.request.file) {
          await deleteFile(ctx.request.file.path)
        }
        setResponse(ctx, { action: action.type, payload: action.payload })
        return
      }
    }
    await next()
  } catch (err) {
    setResponse(ctx, { action: ActionStatus.Error })
  }
}

const validateUpload = async (ctx: Koa.Context, next: Koa.Next) =>
  await validateFile({ ctx, next }, UploadImage)

const validateCreateCollection = async (ctx: Koa.Context, next: Koa.Next) =>
  await validateBody({ ctx, next }, CreateCollection)

const validateGetAll = async (ctx: Koa.Context, next: Koa.Next) =>
  await validateQuery({ ctx, next }, GetAll)

export {
  isValidCreate,
  validateCreate,
  validateUpload,
  validateCreateCollection,
  validateUpdate,
  validateGetAll,
}

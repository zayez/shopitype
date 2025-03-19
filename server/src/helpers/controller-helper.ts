import pluralize from 'pluralize'
import mapper from './props-mapper-output'
import ActionStatus, { ActionStatusType } from '../types/action-status'
import { modelMap } from '../utils/model-utils'
import { ModelType } from '../models/entity'
import { Product } from '../models/product'
import { Category } from '../models/category'
import { User } from '../models/user'
import { PaginationOptions } from '../lib/query-builder/query-builder'
import { Repository } from '../repositories/repository'
import { EntityEnum } from '../types/entity-type'

const plur = pluralize

interface ActionResult {
  action: ActionStatusType
  payload: any
}

interface ControllerFunctions {
  create: (model: any) => Promise<ActionResult>
  update: (id: any, model: any) => Promise<ActionResult>
  destroy: (id: any) => Promise<ActionResult>
  getOne: (id: any) => Promise<ActionResult>
  getAll: (pagination?: any) => Promise<ActionResult>
}

const mapperMap = {
  category: mapper.mapCategory,
  order: mapper.mapOrder,
  product: mapper.mapProduct,
  productstatus: mapper.mapProductStatus,
  user: mapper.mapUser,
}

type CreateEntityType = Category | Product | User

export default (controllerName: string): ControllerFunctions => {
  const modelName = plur.singular(controllerName).toLowerCase() as ModelType

  const Model = modelMap[modelName]
  const mapEntity = mapperMap[modelName]

  const create = async (model: CreateEntityType) => {
    try {
      if (
        modelName !== EntityEnum.Category &&
        modelName !== EntityEnum.Product
      ) {
        throw new Error(`Create operation is not supported for ${modelName}`)
      }
      const creatableModel = Model as Repository<Category | Product>
      const createdModel = await creatableModel.create(model)
      if (createdModel) {
        const payload = mapEntity(createdModel)

        return {
          action: ActionStatus.Created,
          payload,
        }
      }
      return {
        action: ActionStatus.BadRequest,
        payload: null,
      }
    } catch (err) {
      throw err
    }
  }

  type UpdateEntityType = Category | User

  const update = async (id: number, model: UpdateEntityType) => {
    try {
      if (modelName !== EntityEnum.Category && modelName !== EntityEnum.User) {
        throw new Error(`Update operation is not supported for ${modelName}`)
      }

      const updatableModel = Model as Repository<Category | User>
      const updatedModel = await updatableModel.update(id, model)
      if (updatedModel) {
        const payload = mapEntity(updatedModel)
        return {
          action: ActionStatus.Ok,
          payload,
        }
      }
      return {
        action: ActionStatus.BadRequest,
        payload: null,
      }
    } catch (err) {
      throw err
    }
  }

  const destroy = async (id: number) => {
    try {
      if (modelName === EntityEnum.ProductStatus) {
        throw new Error(`Destroy operation is not supported for ${modelName}`)
      }

      const destroyableModel = Model as Repository<Category | User | Product>
      const selectedModel = await destroyableModel.destroy(id)
      if (selectedModel) {
        return {
          action: ActionStatus.Ok,
          payload: selectedModel,
        }
      }
      return {
        action: ActionStatus.BadRequest,
        payload: null,
      }
    } catch (err) {
      throw err
    }
  }

  const getOne = async (id: number) => {
    try {
      const selectedModel = await Model.findById(id)
      if (selectedModel) {
        const payload = mapEntity(selectedModel)

        return {
          action: ActionStatus.Ok,
          payload,
        }
      }
      return {
        action: ActionStatus.NotFound,
        payload: null,
      }
    } catch (err) {
      throw err
    }
  }

  const getAll = async (pagination: PaginationOptions) => {
    try {
      const models = await Model.findAll(pagination)
      if (models) {
        const payload = models.map(mapEntity)
        return {
          action: ActionStatus.Ok,
          payload,
        }
      }
      return {
        action: ActionStatus.NotFound,
        payload: null,
      }
    } catch (err) {
      throw err
    }
  }

  return {
    create,
    update,
    destroy,
    getOne,
    getAll,
  }
}

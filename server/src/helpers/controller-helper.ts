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
import { ProductStatus } from '../models/product-status'

const plur = pluralize

type CreateEntityType = Category | Product | User
type UpdateEntityType = Category | User
type DestroyEntityType = number
type GetOneEntityType = Category | Product | User | ProductStatus
type GetAllEntityType = Category[] | Product[] | User[] | ProductStatus[]

interface ActionResultBase {
  action: ActionStatusType
}

interface ActionResultCreate extends ActionResultBase {
  payload: CreateEntityType | null | undefined
}

interface ActionResultUpdate extends ActionResultBase {
  payload: UpdateEntityType | null | undefined
}

interface ActionResultDestroy extends ActionResultBase {
  payload: DestroyEntityType | null | undefined
}

interface ActionResultGetOne extends ActionResultBase {
  payload: GetOneEntityType | null | undefined
}

interface ActionResultGetAll extends ActionResultBase {
  payload: GetAllEntityType | null | undefined
}

interface ControllerFunctions {
  create: (model: CreateEntityType) => Promise<ActionResultCreate>
  update: (id: number, model: UpdateEntityType) => Promise<ActionResultUpdate>
  destroy: (id: number) => Promise<ActionResultDestroy>
  getOne: (id: number) => Promise<ActionResultGetOne>
  getAll: (pagination?: PaginationOptions) => Promise<ActionResultGetAll>
}

const mapperMap = {
  category: mapper.mapCategory,
  order: mapper.mapOrder,
  product: mapper.mapProduct,
  productstatus: mapper.mapProductStatus,
  user: mapper.mapUser,
}

export default (controllerName: string): ControllerFunctions => {
  const modelName = plur.singular(controllerName).toLowerCase() as ModelType

  const Model = modelMap[modelName]
  const mapEntity = mapperMap[modelName]

  const create = async (model: CreateEntityType) => {
    if (modelName !== EntityEnum.Category && modelName !== EntityEnum.Product) {
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
  }

  const update = async (id: number, model: UpdateEntityType) => {
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
  }

  const destroy = async (id: number) => {
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
  }

  const getOne = async (id: number) => {
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
  }

  const getAll = async (pagination?: PaginationOptions) => {
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
  }

  return {
    create,
    update,
    destroy,
    getOne,
    getAll,
  }
}

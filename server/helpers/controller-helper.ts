import pluralize from 'pluralize'
import { upperCaseFirst } from 'upper-case-first'
import mapper from './props-mapper-output'
import ActionStatus, { ActionStatusType } from '../types/action-status'
import { modelMap } from '../utils/model-utils'

const plur = pluralize
const capitalize = upperCaseFirst

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

// Try to use the in the modelMap as
// type model = 'user' | 'category' | 'order' | 'productstatus' | 'product'

export default (controllerName: string): ControllerFunctions => {
  const modelName = plur.singular(controllerName)
  const Model = modelMap[modelName.toLowerCase()]
  const entity = capitalize(modelName)
  const mapEntity = mapper[`map${entity}`]

  const create = async (model) => {
    try {
      const createdModel = await Model.create(model)
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

  const update = async (id, model) => {
    try {
      const updatedModel = await Model.update(id, model)
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

  const destroy = async (id) => {
    try {
      const selectedModel = await Model.destroy(id)
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

  const getOne = async (id) => {
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

  const getAll = async (pagination) => {
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

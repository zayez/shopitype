import path from 'path'
import controllerHelper from '../helpers/controllerHelper'
import mapper from '../helpers/propsMapperOutput'
import User from '../models/user'
import ActionStatus from '../types/ActionStatus'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const controllerName = path.parse(__filename).name

const { update, destroy, getOne, getAll } = controllerHelper(controllerName)

const create = async (user, roles) => {
  try {
    const savedUser = await User.create({ user, roles })

    if (savedUser) {
      return {
        action: ActionStatus.Created,
        payload: mapper.mapUser(savedUser),
      }
    }
    return {
      action: ActionStatus.CreateError,
    }
  } catch (err) {
    throw err
  }
}

const getAllByRoles = async (role) => {
  try {
    const users = await User.findAllByRoles(role)
    if (users) {
      return {
        action: ActionStatus.Ok,
        payload: users.map(mapper.mapUser),
      }
    }

    return {
      action: ActionStatus.Error,
    }
  } catch (err) {
    throw err
  }
}

const UsersController = {
  update,
  destroy,
  getOne,
  getAll,
  create,
  getAllByRoles,
}

export default UsersController

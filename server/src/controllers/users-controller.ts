import ActionStatus from '../types/action-status'
import controllerHelper from '../helpers/controller-helper'
import mapper from '../helpers/props-mapper-output'
import UserRepository from '../repositories/user-repository'
import { User } from '../models/user'
import { RoleType } from '../types/role-type'

const controllerName = 'users'

const { update, destroy, getOne, getAll } = controllerHelper(controllerName)

const create = async (user: User, roles: string[]) => {
  try {
    const savedUser = await UserRepository.create({ user, roles })

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

const getAllByRoles = async (roles: RoleType[]) => {
  try {
    const users = await UserRepository.findAllByRoles(roles)
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

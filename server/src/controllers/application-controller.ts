import ActionStatus from '../types/action-status'
import { signToken } from '../helpers/jwt-helpers'
import UserRepository from '../repositories/user-repository'
import { User } from '../models/user'

const getRoot = async () => {
  return {
    action: ActionStatus.Ok,
    payload: { greeting: 'hella!' },
  }
}

async function signUp(user: User) {
  const roles = ['customer']
  const savedUser = await UserRepository.create({ user, roles })

  if (savedUser.id) {
    const token = signToken(savedUser.id)
    return {
      action: ActionStatus.Created,
      payload: { token, user: savedUser },
    }
  }
  return {
    action: ActionStatus.SignUpError_CreateUserFailed,
  }
}

async function signIn(user: User) {
  const token = signToken(user.id)
  return { action: ActionStatus.Ok, payload: { token } }
}

const ApplicationController = {
  getRoot,
  signIn,
  signUp,
}

export default ApplicationController

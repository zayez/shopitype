import { signToken } from '../helpers/jwtHelpers'
import User from '../models/user'
import ActionStatus from '../types/ActionStatus'

const getRoot = async () => {
  return {
    action: ActionStatus.Ok,
    payload: { greeting: 'hella!' },
  }
}

async function signUp(user) {
  const roles = ['customer']
  try {
    const savedUser = await User.create({ user, roles })

    if (savedUser) {
      const token = signToken(savedUser.id)
      return {
        action: ActionStatus.Created,
        payload: { token, user: savedUser },
      }
    }
    return {
      action: ActionStatus.SignUpError_CreateUserFailed,
    }
  } catch (err) {
    throw err
  }
}

async function signIn(user) {
  const token = signToken(user.id)
  return { action: ActionStatus.Ok, payload: { token } }
}

const ApplicationController = {
  getRoot,
  signIn,
  signUp,
}

export default ApplicationController

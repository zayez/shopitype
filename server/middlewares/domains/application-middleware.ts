import ApplicationController from '../../controllers/application-controller'
import { setResponse } from '../../helpers/middleware-helpers'
import ActionStatus from '../../types/action-status'

import mapper from '../../helpers/props-mapper-input'
import outputMapper from '../../helpers/props-mapper-output'

const mapUser = outputMapper.mapUser

const getRoot = async (ctx) => {
  try {
    const { action, payload } = await ApplicationController.getRoot()
    setResponse(ctx, { action, payload })
  } catch (err) {
    setResponse(ctx, { action: ActionStatus.Error })
  }
}

const signIn = async (ctx) => {
  try {
    const user = ctx.state.user
    const { action, payload } = await ApplicationController.signIn(user)
    setResponse(ctx, {
      action,
      payload: { user: mapUser(user), token: payload.token },
    })
    const cookieOpts = {
      httpOnly: true,
      sameSite: true,
      path: '/',
      secure: false,
      signed: false,
    }
    ctx.cookies.set('token', payload.token, cookieOpts)
  } catch (err) {
    setResponse(ctx, { action: ActionStatus.Error })
  }
}

const signUp = async (ctx) => {
  try {
    const user = mapper.mapUser(ctx.request.body)
    const { action, payload } = await ApplicationController.signUp(user)
    setResponse(ctx, {
      action,
      payload: { user: mapUser(payload.user), token: payload.token },
    })
    const cookieOpts = {
      httpOnly: true,
      sameSite: true,
      path: '/',
      secure: false,
      signed: false,
    }
    ctx.cookies.set('token', payload.token, cookieOpts)
  } catch (err) {
    setResponse(ctx, { action: ActionStatus.Error })
  }
}

const signOut = async (ctx) => {
  try {
    setResponse(ctx, {
      action: ActionStatus.Ok,
      payload: null,
    })
    ctx.cookies.set('token', null)
  } catch (err) {
    setResponse(ctx, { action: ActionStatus.Error })
  }
}

const getUser = async (ctx) => {
  try {
    if (!ctx.state.user) {
      setResponse(ctx, { action: ActionStatus.Unauthorized })
      return
    }
    const user = mapUser(ctx.state.user)
    setResponse(ctx, { action: ActionStatus.Ok, payload: user })
  } catch (err) {
    setResponse(ctx, { action: ActionStatus.Error })
  }
}

const ApplicationMiddleware = {
  getRoot,
  signIn,
  signUp,
  signOut,
  getUser,
}

export default ApplicationMiddleware

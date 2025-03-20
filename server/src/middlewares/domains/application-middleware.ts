import ActionStatus from '../../types/action-status'
import ApplicationController from '../../controllers/application-controller'
import { setResponse } from '../../helpers/middleware-helpers'
import mapper from '../../helpers/props-mapper-input'
import outputMapper from '../../helpers/props-mapper-output'
import Koa from 'koa'

const mapUser = outputMapper.mapUser

const getRoot = async (ctx: Koa.Context) => {
  try {
    const { action, payload } = await ApplicationController.getRoot()
    setResponse(ctx, { action, payload })
  } catch (err) {
    setResponse(ctx, { action: ActionStatus.Error })
  }
}

const signIn = async (ctx: Koa.Context) => {
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

const signUp = async (ctx: Koa.Context) => {
  try {
    const user = mapper.mapUser(ctx.request.body)
    const { action, payload } = await ApplicationController.signUp(user)
    if (!payload) {
      setResponse(ctx, { action: ActionStatus.Error })
      return
    }
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

const signOut = async (ctx: Koa.Context) => {
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

const getUser = async (ctx: Koa.Context) => {
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

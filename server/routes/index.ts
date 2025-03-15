import Router from 'koa-router'
import {
  GET_ROOT,
  GET_SIGN_OUT,
  GET_USER_LOGGED,
  POST_SIGN_IN,
  POST_SIGN_UP,
} from '../api/endpointUrls'
import ApplicationPipeline from '../middlewares/application'
const router = new Router()

router.get(GET_ROOT, ApplicationPipeline.getRoot)
router.post(POST_SIGN_IN, ApplicationPipeline.signIn)
router.post(POST_SIGN_UP, ApplicationPipeline.signUp)
router.get(GET_SIGN_OUT, ApplicationPipeline.signOut)
router.get(GET_USER_LOGGED, ApplicationPipeline.getUser)

export default router

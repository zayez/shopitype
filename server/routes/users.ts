import Router from 'koa-router'
import {
  DELETE_USER,
  GET_USER,
  GET_USERS,
  PATCH_USER,
  POST_USER,
} from '../api/endpointUrls'
import UsersPipeline from '../middlewares/users'

const router = new Router()

router.post(POST_USER, UsersPipeline.create)
router.patch(PATCH_USER, UsersPipeline.update)
router.delete(DELETE_USER, UsersPipeline.destroy)
router.get(GET_USER, UsersPipeline.get)
router.get(GET_USERS, UsersPipeline.getAll)

export default router

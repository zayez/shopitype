import {
  authorizeAdmin,
  authorizeCustomer,
  authorizeEditor,
  authorizeManagers,
  authorizeRoles,
} from './authorization'
import { userExists } from './verify'

const authorization = {
  authorizeRoles,
  authorizeAdmin,
  authorizeEditor,
  authorizeCustomer,
  authorizeManagers,
}

const verifySignUp = { userExists }

export { authorization, verifySignUp }

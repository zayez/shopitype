import { Role } from '../models/role'
import { User } from '../models/user'

const admin = ['admin']
const editor = ['editor']
const customer = ['customer']
const manager = [...admin, ...editor]

const isAdmin = (user: User) => {
  if (!user) return false
  const userRoles = user.roles
  if (!userRoles) {
    return false
  }
  admin.some((role) => userRoles.includes(role))
}

const isEditor = (user: User) => {
  if (!user) return false
  const userRoles = user.roles
  if (!userRoles) {
    return false
  }
  editor.some((role) => userRoles.includes(role))
}

const isManager = (user: User) => {
  if (!user) return false
  const userRoles = user.roles
  if (!userRoles) {
    return false
  }
  return manager.some((role) => userRoles.includes(role))
}

const isCustomer = (user: User) => {
  if (!user) return false
  const userRoles = user.roles
  if (!userRoles) {
    return false
  }
  return customer.some((role) => userRoles.includes(role))
}

export { isAdmin, isEditor, isManager, isCustomer }

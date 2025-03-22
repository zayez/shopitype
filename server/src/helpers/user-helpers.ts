import { User } from '../models/user'
import { RoleType } from '../types/role-type'

const admin = ['admin'] as RoleType[]
const editor = ['editor'] as RoleType[]
const customer = ['customer'] as RoleType[]
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

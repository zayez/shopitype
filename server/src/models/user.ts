import { RoleType } from '../types/role-type'
import { Role } from './role'

export interface User {
  id?: number
  email?: string
  firstName?: string
  lastName?: string
  password?: string
  roles?: RoleType[]
  createdAt?: any
  updatedAt?: any
}

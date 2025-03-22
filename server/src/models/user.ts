import { RoleType } from '../types/role-type'

export interface User {
  id: number
  email: string
  firstName?: string
  lastName?: string
  password: string
  roles: RoleType[]
  createdAt: Date
  updatedAt: Date
}

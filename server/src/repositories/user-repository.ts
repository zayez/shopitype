import knex from '../db/db'
import bcrypt from 'bcrypt'
import { Repository } from '../repositories/repository'
import { User } from '../models/user'
import queryBuilder from '../lib/query-builder/query-builder'
import { RoleType } from '../types/role-type'
import { Role } from '../models/role'

const TABLE_NAME = 'users'
const SELECTABLE_FIELDS = [
  'id',
  'email',
  'password',
  'firstName',
  'lastName',
  'updatedAt',
  'createdAt',
]

const tableName = TABLE_NAME
const fields = SELECTABLE_FIELDS

const { find, findAll, destroy, destroyAll, includesAny } = queryBuilder(
  TABLE_NAME,
  SELECTABLE_FIELDS,
)

const hashPassword = async (password: string, saltRounds = 10) => {
  try {
    const salt = await bcrypt.genSalt(saltRounds)
    return await bcrypt.hash(password, salt)
  } catch (err) {
    throw err
  }
}

const getUserRoles = async (id: number) => {
  return (await knex('roles').whereIn(
    'id',
    knex('userRoles').select('roleId').where('userId', id),
  )) as Role[]
}

async function hasRole(user: User, roles: string[]) {
  if (!user.id) {
    throw new Error('User has no id')
  }
  const userRoles = await getUserRoles(user.id)
  return userRoles.some((r) => roles.includes(r.name))
}

async function matchPassword(email: string, password: string) {
  const user = await knex('users').select('*').where('email', email).first()

  try {
    return await bcrypt.compare(password, user.password)
  } catch (err) {
    throw err
  }
}

async function comparePassword(password: string, encryptedPassword: string) {
  try {
    return await bcrypt.compare(password, encryptedPassword)
  } catch (err) {
    throw err
  }
}

export interface UserCreateParams {
  user: any
  roles?: string[]
}

async function create(userData: UserCreateParams) {
  const { user, roles = ['customer'] } = userData

  const hashedPassword = await hashPassword(user.password)
  const newUser = {
    email: user.email,
    password: hashedPassword,
    firstName: user.firstName,
    lastName: user.lastName,
  }

  const resInsert = await knex('users').insert(newUser)
  const userId = resInsert[0]

  if (!userId) return null

  const createdUser = await findById(userId)
  const selectedRoles = await knex('roles').select('id').whereIn('name', roles)

  for (const role of selectedRoles) {
    await knex('userRoles').insert([{ userId, roleId: role.id }])
  }

  const createdUserRoles = await getUserRoles(createdUser.id)
  createdUser.roles = createdUserRoles.map((r) => r.name)
  return createdUser
}

const update = async (id: number, props: User) => {
  if (props.password) {
    const hashedPassword = await hashPassword(props.password)
    props.password = hashedPassword
  }
  await knex(TABLE_NAME).update(props).where({ id })
  return await findById(id)
}

const findOne = async (filters?: Partial<User>): Promise<User | null> => {
  const user = filters
    ? await knex(TABLE_NAME).first(SELECTABLE_FIELDS).where(filters)
    : await knex(TABLE_NAME).first(SELECTABLE_FIELDS)
  if (!user) return null

  const roles = await getUserRoles(user.id)
  user.roles = roles.map((r) => r.name)
  return user
}

const findById = async (id: number) => {
  const user = await knex(TABLE_NAME).first(SELECTABLE_FIELDS).where({ id })
  if (!user) return null

  const roles = await getUserRoles(user.id)
  user.roles = roles.map((r) => r.name)
  return user
}

const findAllByRoles = async (roles: RoleType[]) => {
  const selectedRoles = await knex('roles').select('id').whereIn('name', roles)
  if (!selectedRoles) return []

  const userRoles = await knex('userRoles').whereIn(
    'roleId',
    selectedRoles.map((r) => r.id),
  )
  if (!userRoles) return []

  const ids = userRoles.map((u) => u.id)
  const users = await knex(TABLE_NAME).whereIn('id', ids)
  return users
}

const UserRepository: Repository<User, UserCreateParams> = {
  tableName,
  fields,
  find,
  findAll,
  destroy,
  destroyAll,
  includesAny,
  hasRole,
  matchPassword,
  comparePassword,
  create,
  update,
  findOne,
  findById,
  findAllByRoles,
}

export default UserRepository

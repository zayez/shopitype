const admin = ['admin']
const editor = ['editor']
const customer = ['customer']
const manager = [...admin, ...editor]

const isAdmin = (user) => {
  if (!user) return false
  const userRoles = user.roles
  admin.some((role) => userRoles.includes(role))
}

const isEditor = (user) => {
  if (!user) return false
  const userRoles = user.roles
  editor.some((role) => userRoles.includes(role))
}

const isManager = (user) => {
  if (!user) return false
  const userRoles = user.roles
  return manager.some((role) => userRoles.includes(role))
}

const isCustomer = (user) => {
  if (!user) return false
  const userRoles = user.roles
  return customer.some((role) => userRoles.includes(role))
}

export { isAdmin, isEditor, isManager, isCustomer }

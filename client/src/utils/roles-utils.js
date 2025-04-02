export const isManager = (user) => {
  if (!user) return false

  const userRoles = user.roles
  return ['admin', 'editor'].some((role) => userRoles.includes(role))
}

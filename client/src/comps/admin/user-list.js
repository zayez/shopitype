import { useRouter } from 'next/router'
import { CUSTOMER_ROLE } from '../../types/roles'

const UserItem = ({ user, role }) => {
  const router = useRouter()
  const handleItemClick = (e) => {
    const roleRoute = role === CUSTOMER_ROLE ? `customers` : `users`
    e.preventDefault()
    router.push(`/admin/${roleRoute}/${user.id}`)
  }
  return (
    <tr onClick={handleItemClick}>
      <td>{user.id}</td>
      <td>
        {user.firstName} {user.lastName}
      </td>
      <td>{user.email}</td>
    </tr>
  )
}

const UserList = ({ users, role }) => {
  return (
    <div className="users-list">
      <table className="table-basic">
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>E-mail</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <UserItem user={user} role={role} key={user.id} />
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default UserList

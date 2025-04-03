import { useRouter } from 'next/router'
import { useState } from 'react'
import { useAuthStore } from '../../stores/auth-store'
import { useShallow } from 'zustand/shallow'
import { useUsersStore } from '../../stores/users-store'

const Profile = ({ firstName, lastName, email }) => {
  const router = useRouter()
  const { user } = useAuthStore(
    useShallow((state) => ({
      user: state.user,
    })),
  )

  const { updateUser } = useUsersStore(
    useShallow((state) => ({
      updateUser: state.updateUser,
    })),
  )

  const [txtFirstName, setFirstName] = useState(firstName)
  const [txtLastName, setLastName] = useState(lastName)
  const [txtEmail, setEmail] = useState(email)

  const handleSubmit = async (event) => {
    event.preventDefault()

    updateUser({
      id: user.id,
      firstName: txtFirstName,
      lastName: txtLastName,
      email: txtEmail,
    })
  }

  return (
    <div className="container">
      <div className="profile">
        <h2>Profile</h2>
        <form className="form" onSubmit={handleSubmit}>
          <div className="field">
            <div className="field-label">
              <label htmlFor="first-name">First name:</label>
            </div>
            <div className="field-body">
              <input
                id="first-name"
                type="text"
                value={txtFirstName}
                onChange={({ target }) => setFirstName(target?.value)}
              />
            </div>
          </div>

          <div className="field">
            <div className="field-label">
              <label htmlFor="last-name">Last name:</label>
            </div>
            <div className="field-body">
              <input
                id="last-name"
                type="text"
                value={txtLastName}
                onChange={({ target }) => setLastName(target?.value)}
              />
            </div>
          </div>

          <div className="field">
            <div className="field-label">
              <label htmlFor="email">E-mail:</label>
            </div>
            <div className="field-body">
              <input
                id="email"
                type="text"
                value={txtEmail}
                onChange={({ target }) => setEmail(target?.value)}
              />
            </div>
          </div>
          <button className="btn">Save</button>
        </form>
      </div>
    </div>
  )
}

export default Profile

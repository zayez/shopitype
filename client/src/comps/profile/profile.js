import { useRouter } from 'next/router'
import { useState } from 'react'
import { useEffect } from 'react'
import { useAuthStore } from '../../stores/auth-store'
import { useShallow } from 'zustand/shallow'

const Profile = ({ firstName, lastName, email }) => {
  const router = useRouter()
  const { user, fetchUser } = useAuthStore(
    useShallow((state) => ({
      user: state.user,
      fetchUser: state.fetchUser,
    })),
  )

  const [txtFirstName, setFirstName] = useState(firstName)
  const [txtLastName, setLastName] = useState(lastName)
  const [txtEmail, setEmail] = useState(email)

  useEffect(() => {
    if (!user) {
      return
    }
    fetchUser({ id: user.id })
  }, [user])

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!user) {
      router.push('/signin')
    }
    updateUser({
      id: auth.user.id,
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
              <label>First name:</label>
            </div>
            <div className="field-body">
              <input
                type="text"
                value={txtFirstName}
                onChange={({ target }) => setFirstName(target?.value)}
              />
            </div>
          </div>

          <div className="field">
            <div className="field-label">
              <label>Last name:</label>
            </div>
            <div className="field-body">
              <input
                type="text"
                value={txtLastName}
                onChange={({ target }) => setLastName(target?.value)}
              />
            </div>
          </div>

          <div className="field">
            <div className="field-label">
              <label>E-mail:</label>
            </div>
            <div className="field-body">
              <input
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

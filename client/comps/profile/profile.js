import { useRouter } from 'next/router'
import { useState } from 'react'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchUser, selectAuth } from '../../store/slices/authSlice'
import { update } from '../../store/slices/usersSlice'

const Profile = ({ firstName, lastName, email }) => {
  const auth = useSelector(selectAuth)
  const router = useRouter()
  const dispatch = useDispatch()
  const [txtFirstName, setFirstName] = useState(firstName)
  const [txtLastName, setLastName] = useState(lastName)
  const [txtEmail, setEmail] = useState(email)
  useEffect(() => {
    if (auth.user) {
      dispatch(fetchUser({ id: auth.user.id }))
    }
  }, [])

  const handleSubmit = async (event) => {
    if (!auth.user) router.push('/signin')
    event.preventDefault()
    dispatch(
      update({
        id: auth.user.id,
        firstName: txtFirstName,
        lastName: txtLastName,
        email: txtEmail,
      }),
    )
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

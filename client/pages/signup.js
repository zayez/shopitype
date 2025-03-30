import { useRouter } from 'next/router'
import { useState, useRef, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Callout from '../comps/callout/callout'
import { selectAuth, signUp } from '../store/slices/authSlice'

const SignUp = () => {
  const router = useRouter()
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const dispatch = useDispatch()
  const auth = useSelector(selectAuth)

  useEffect(() => {
    if (auth.success) {
      router.push('/')
    }
  }, [auth.success, auth.user, auth.error])

  const handleSubmit = (e) => {
    e.preventDefault()
    dispatch(signUp({ firstName, lastName, email, password }))
  }
  return (
    <div className="container">
      <Callout message={auth.error} />
      <form onSubmit={handleSubmit} className="form">
        <div className="field">
          <label htmlFor="E-mail">First name</label>
          <input
            type="text"
            value={firstName}
            onChange={({ target }) => setFirstName(target?.value)}
          />
        </div>

        <div className="field">
          <label htmlFor="E-mail">Last name</label>
          <input
            type="text"
            value={lastName}
            onChange={({ target }) => setLastName(target?.value)}
          />
        </div>

        <div className="field">
          <label htmlFor="E-mail">E-mail</label>
          <input
            type="text"
            value={email}
            onChange={({ target }) => setEmail(target?.value)}
          />
        </div>

        <div className="field">
          <label htmlFor="E-mail">Password</label>
          <input
            type="password"
            value={password}
            onChange={({ target }) => setPassword(target?.value)}
          />
        </div>

        <div className="field">
          <input type="submit" value="Create account" />
        </div>
      </form>
    </div>
  )
}

export default SignUp

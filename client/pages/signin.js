import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useDispatch, useSelector } from 'react-redux'
import { selectAuth, signIn } from '../store/slices/auth-slice'
import Callout from '../comps/callout/callout'
const SignIn = () => {
  const router = useRouter()
  const baseUrl = `/api`
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const dispatch = useDispatch()
  const auth = useSelector(selectAuth)

  useEffect(() => {
    if (auth.success) {
      router.push('/')
    }
  }, [auth.success, auth.user, auth.error])

  const handleSubmit = async (event) => {
    event.preventDefault()
    dispatch(signIn({ email, password }))
  }

  return (
    <div className="container">
      <Callout message={auth.error} />
      <div className="login">
        <h1>Sign in</h1>
        <form onSubmit={handleSubmit} className="form">
          <div className="field">
            <div className="field-label">
              <label>E-mail:</label>
            </div>
            <div className="field-body">
              <input
                type="text"
                value={email}
                onChange={({ target }) => setEmail(target?.value)}
              />
            </div>
          </div>
          <div className="field">
            <div className="field-label">
              <label>Password:</label>
            </div>
            <div className="field-body">
              <input
                type="password"
                value={password}
                onChange={({ target }) => setPassword(target?.value)}
              />
            </div>
          </div>
          <button className="btn">Login</button>
        </form>
      </div>
    </div>
  )
}

SignIn.getLayout = (page) => page

export default SignIn

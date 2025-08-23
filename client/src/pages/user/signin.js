import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Callout from '../../comps/callout/callout'
import { useAuthStore } from '../../stores/auth-store'
import { useShallow } from 'zustand/shallow'

const SignIn = () => {
  const router = useRouter()
  const { success, error, signIn } = useAuthStore(
    useShallow((state) => ({
      success: state.success,
      signIn: state.signIn,
      error: state.error,
    })),
  )

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  useEffect(() => {
    if (success) {
      router.push('/')
    }
  }, [success])

  const handleSubmit = async (event) => {
    event.preventDefault()
    signIn({ email, password })
  }

  return (
    <div className="container">
      <Callout message={error} />
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

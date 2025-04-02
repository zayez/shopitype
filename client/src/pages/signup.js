import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Callout from '../comps/callout/callout'
import { useAuthStore } from '../store/auth-store'
import { useShallow } from 'zustand/shallow'

const SignUp = () => {
  const router = useRouter()
  const { success, error, signUp } = useAuthStore(
    useShallow((state) => ({
      success: state.success,
      error: state.error,
      signUp: state.signUp,
    })),
  )

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  useEffect(() => {
    if (success) {
      router.push('/')
    }
  }, [success])

  const handleSubmit = (e) => {
    e.preventDefault()
    signUp({ firstName, lastName, email, password })
  }
  return (
    <div className="container">
      <Callout message={error} />
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

import { useEffect } from 'react'
import Profile from '../comps/profile/profile'
import { useAuthStore } from '../stores/auth-store'
import { useShallow } from 'zustand/shallow'

const ProfileView = () => {
  const { user, signUser } = useAuthStore(
    useShallow((state) => ({ user: state.user, signUser: state.signUser })),
  )

  useEffect(() => {
    if (!user) {
      signUser()
    }
  }, [])

  if (!user) return

  const { firstName, lastName, email } = user
  return <Profile firstName={firstName} lastName={lastName} email={email} />
}

export default ProfileView

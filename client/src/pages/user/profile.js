import { useEffect } from 'react'
import Profile from '../../comps/profile/profile'
import { useAuthStore } from '../../stores/auth-store'
import { useShallow } from 'zustand/shallow'
import { useRouter } from 'next/router'

const ProfileView = () => {
  const router = useRouter()
  const { user, signUser } = useAuthStore(
    useShallow((state) => ({ user: state.user, signUser: state.signUser })),
  )

  // TODO: Why was this here?
  // useEffect(() => {
  //   if (!user) {
  //     signUser()
  //   }
  // }, [])

  useEffect(() => {
    if (!user) {
      router.push('/signin')
    }
  }, [])

  const { firstName, lastName, email } = user
  return <Profile firstName={firstName} lastName={lastName} email={email} />
}

export default ProfileView

import { useRouter } from 'next/router'
import { useShallow } from 'zustand/shallow'
import { useEffect } from 'react'
import BaseLayout from '../base-layout/base-layout'
import { isManager } from '../../../utils/roles-utils'
import { useAuthStore } from '../../../stores/auth-store'
import Sidebar from '../../sidebar/sidebar'

const AdminLayout = ({ children }) => {
  const router = useRouter()
  const { user } = useAuthStore(
    useShallow((state) => ({
      user: state.user,
    })),
  )

  useEffect(() => {
    if (!user) {
      return
    }

    if (!isManager(user)) {
      router.push('/signin')
    }
  }, [])

  if (!isManager(user)) {
    return
  }

  return (
    <>
      <div className="container-fluid">
        <div className="flex">
          <Sidebar />
          <div className="content-main">{children}</div>
        </div>
      </div>
    </>
  )
}

export const adminLayout = (page) => {
  return (
    <>
      <BaseLayout>
        <AdminLayout>{page}</AdminLayout>
      </BaseLayout>
    </>
  )
}

export default AdminLayout

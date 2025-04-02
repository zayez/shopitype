import Header from '../header/header'
import Footer from '../footer/footer'
import Sidebar from '../sidebar/sidebar'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { ToastContainer } from 'react-toastify'
import { useAuthStore } from '../../stores/auth-store'
import { useShallow } from 'zustand/shallow'

const Toast = ({}) => {
  return (
    <ToastContainer
      position="bottom-right"
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="light"
    />
  )
}

const BaseLayout = ({ children }) => {
  return (
    <>
      <Toast />
      {children}
    </>
  )
}

const StoreLayout = ({ children }) => {
  return (
    <>
      <BaseLayout />
      <div className="container">
        <Header />
        {children}
        <Footer />
        <ToastContainer />
      </div>
    </>
  )
}

const isManager = (user) => {
  if (!user) return false
  const userRoles = user.roles
  return ['admin', 'editor'].some((role) => userRoles.includes(role))
}

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

const storeLayout = (page) => {
  return (
    <>
      <StoreLayout>{page}</StoreLayout>
    </>
  )
}

const adminLayout = (page) => {
  return (
    <>
      <BaseLayout>
        <AdminLayout>{page}</AdminLayout>
      </BaseLayout>
    </>
  )
}

export { storeLayout, adminLayout }

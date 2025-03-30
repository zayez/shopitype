import Header from './Header'
import Footer from './Footer'
import Sidebar from './Sidebar'
import { useSelector } from 'react-redux'
import { selectAuth } from '../src/store/slices/authSlice'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { ToastContainer } from 'react-toastify'

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
  const auth = useSelector(selectAuth)

  useEffect(() => {
    if (!auth.user) {
      router.push('/signin')
    }
  }, [auth])
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

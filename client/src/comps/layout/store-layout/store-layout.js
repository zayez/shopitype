import { ToastContainer } from 'react-toastify'
import Footer from '../../footer/footer'
import Header from '../../header/header'
import BaseLayout from '../base-layout/base-layout'

const StoreLayout = ({ children }) => {
  return (
    <>
      <BaseLayout />
      <div className="container">
        <Header />
        {children}
        <Footer />
      </div>
    </>
  )
}

export const storeLayout = (page) => {
  return (
    <>
      <StoreLayout>{page}</StoreLayout>
    </>
  )
}

export default StoreLayout

import Toast from '../../vendor/toast/toast'

const BaseLayout = ({ children }) => {
  return (
    <>
      <Toast />
      {children}
    </>
  )
}

export default BaseLayout

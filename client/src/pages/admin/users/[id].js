import Head from 'next/head'
import { adminLayout } from '../../../comps/layout/layout'

const User = ({}) => {
  return (
    <>
      <Head>
        <title>Storefly dashboard - Order</title>
      </Head>
      <div className="container">
        <h1>User</h1>
      </div>
    </>
  )
}

User.getLayout = adminLayout

export default User

import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import CustomerForm from '../../../comps/admin/customer-form'
import { adminLayout } from '../../../comps/layout/layout'
import { useUsersStore } from '../../../stores/users-store'
import { useShallow } from 'zustand/shallow'

const User = () => {
  const router = useRouter()
  const { selectedUser, fetchUser } = useUsersStore(
    useShallow((state) => ({
      selectedUser: state.selectedUser,
      fetchUser: state.fetchUser,
    })),
  )
  const customer = selectedUser
  const { id } = router.query

  useEffect(() => {
    if (!id) {
      return
    }

    fetchUser(id)
  }, [])
  return (
    <>
      <Head>
        <title>Shopitype dashboard - Order</title>
      </Head>
      <div className="container">
        <h1>Customer</h1>

        {selectedUser ? <CustomerForm {...customer} /> : null}
      </div>
    </>
  )
}

User.getLayout = adminLayout

export default User

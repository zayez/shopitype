import Head from 'next/head'
import React, { useEffect } from 'react'
import { Users as IUsers } from 'react-feather'
import { adminLayout } from '../../../comps/layout/admin-layout/admin-layout'
import UserList from '../../../comps/admin/user-list'
import { CUSTOMER_ROLE } from '../../../types/roles'
import { useUsersStore } from '../../../stores/users-store'
import { useShallow } from 'zustand/shallow'

const Users = () => {
  const { users, loading, error, fetchUsersByRoles } = useUsersStore(
    useShallow((state) => ({
      users: state.users,
      loading: state.loading,
      error: state.error,
      fetchUsersByRoles: state.fetchUsersByRoles,
    })),
  )

  useEffect(() => {
    fetchUsersByRoles([CUSTOMER_ROLE])
  }, [])

  return (
    <>
      <Head>
        <title>Shopitype dashboard | Users </title>
      </Head>
      <div>
        <h1 className="heading">
          <IUsers /> <span>Customers</span>
        </h1>
        <hr />

        {loading && <div>Loading...</div>}
        {error && <div>Error: {error}</div>}
        {users.length && <UserList users={users} role={`customer`} />}
      </div>
    </>
  )
}

Users.getLayout = adminLayout

export default Users

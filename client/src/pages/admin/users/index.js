import Head from 'next/head'
import React, { useEffect } from 'react'
import { Users as IUsers } from 'react-feather'
import { adminLayout } from '../../../comps/layout/layout'
import UserList from '../../../comps/admin/user-list'
import { ADMIN_ROLE, EDITOR_ROLE } from '../../../types/roles'
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
    fetchUsersByRoles([ADMIN_ROLE, EDITOR_ROLE])
  }, [])

  return (
    <>
      <Head>
        <title>Shopitype dashboard | Users </title>
      </Head>
      <div>
        <h1 className="heading">
          <IUsers /> <span>Users</span>
        </h1>
        <hr />

        {loading && <div>Loading...</div>}
        {error && <div>Error: {error}</div>}
        {!!users?.length && <UserList users={users} />}
      </div>
    </>
  )
}

Users.getLayout = adminLayout

export default Users

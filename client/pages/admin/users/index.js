import Head from 'next/head'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Users as IUsers } from 'react-feather'
import { adminLayout } from '../../../comps/layout/layout'
import UserList from '../../../comps/admin/UserList'
import {
  fetchUsersByRoles,
  selectUsers,
} from '../../../store/slices/usersSlice'
import { ADMIN_ROLE, EDITOR_ROLE } from '../../../types/roles'

const Users = ({}) => {
  const users = useSelector(selectUsers)
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(fetchUsersByRoles([ADMIN_ROLE, EDITOR_ROLE]))
  }, [])
  return (
    <>
      <Head>
        <title>Storefly dashboard | Users </title>
      </Head>
      <div>
        <h1 className="heading">
          <IUsers /> <span>Users</span>
        </h1>
        <hr />

        {users.loading && <div>Loading...</div>}
        {!users.loading && users.error ? <div>Error: {users.error}</div> : null}
        {!users.loading && users.users?.length ? (
          <UserList users={users.users} />
        ) : null}
      </div>
    </>
  )
}

Users.getLayout = adminLayout

export default Users

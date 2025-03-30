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
import { CUSTOMER_ROLE } from '../../../types/Roles'

const Users = ({}) => {
  const users = useSelector(selectUsers)
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(fetchUsersByRoles([CUSTOMER_ROLE]))
  }, [])
  return (
    <>
      <Head>
        <title>Storefly dashboard | Users </title>
      </Head>
      <div>
        <h1 className="heading">
          <IUsers /> <span>Customers</span>
        </h1>
        <hr />

        {users.loading && <div>Loading...</div>}
        {!users.loading && users.error ? <div>Error: {users.error}</div> : null}
        {!users.loading && users?.users.length ? (
          <UserList users={users.users} role={`customer`} />
        ) : null}
      </div>
    </>
  )
}

Users.getLayout = adminLayout

export default Users

import Head from 'next/head'
import { adminLayout } from '../../../comps/layout/layout'

import { Layers as IOrders } from 'react-feather'
import OrderList from '../../../comps/admin/OrderList'
import { fetchOrders, selectOrders } from '../../../store/slices/ordersSlice'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Loader from '../../../comps/loader/loader'
import { SPINNER_TYPE } from '../../../types/loader-type'

const Orders = () => {
  const dispatch = useDispatch()
  const orders = useSelector(selectOrders)

  useEffect(() => {
    dispatch(fetchOrders())
  }, [])

  return (
    <>
      <Head>
        <title>Storefly dashboard - Orders</title>
      </Head>
      <div className="container">
        <div className="heading">
          <IOrders />
          <h1>Orders</h1>
        </div>
        <hr />
        {orders.loading ? <Loader type={SPINNER_TYPE} /> : null}
        {!orders.loading && orders.error ? (
          <div>Error: {orders.error}</div>
        ) : null}
        {!orders.loading && orders.orders?.length ? (
          <OrderList orders={orders.orders} />
        ) : null}
      </div>
    </>
  )
}

Orders.getLayout = adminLayout

export default Orders

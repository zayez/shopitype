import Head from 'next/head'
import { adminLayout } from '../../../comps/layout/layout'

import { Layers as IOrders } from 'react-feather'
import OrderList from '../../../comps/admin/order-list'
import { useEffect } from 'react'
import Loader from '../../../comps/loader/loader'
import { SPINNER_TYPE } from '../../../types/loader-type'
import { useOrdersStore } from '../../../stores/orders-store'
import { useShallow } from 'zustand/shallow'

const Orders = () => {
  const { orders, loading, error, fetchOrders } = useOrdersStore(
    useShallow((state) => ({
      orders: state.orders,
      loading: state.loading,
      error: state.error,
      fetchOrders: state.fetchOrders,
    })),
  )

  useEffect(() => {
    fetchOrders()
  }, [])

  if (loading) {
    return <Loader type={SPINNER_TYPE} />
  }

  return (
    <>
      <Head>
        <title>Shopitype dashboard - Orders</title>
      </Head>
      <div className="container">
        <div className="heading">
          <IOrders />
          <h1>Orders</h1>
        </div>
        <hr />

        {error && <div>Error: {error}</div>}
        {!!orders?.length && <OrderList orders={orders} />}
      </div>
    </>
  )
}

Orders.getLayout = adminLayout

export default Orders

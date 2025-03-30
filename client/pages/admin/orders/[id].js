import { format } from 'date-fns'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { adminLayout } from '../../../comps/layout/layout'
import Loader from '../../../comps/loader/loader'
import { calculateSubtotal } from '../../../store/slices/cartSlice'
import {
  fetchOrder,
  markShippingStatus,
  selectOrders,
} from '../../../store/slices/ordersSlice'
import { SPINNER_TYPE } from '../../../types/LoaderType'

import { Octagon, Circle } from 'react-feather'

import {
  SHIPPING_DELIVERED,
  SHIPPING_SHIPPED,
  SHIPPING_UNSHIPPED,
} from '../../../../server/types/ShippingStatus'

import {
  PAYMENT_PAID,
  PAYMENT_UNPAID,
} from '../../../../server/types/PaymentStatus'

const Order = () => {
  const router = useRouter()
  const dispatch = useDispatch()
  const orders = useSelector(selectOrders)
  const { id } = router.query
  const curOrder = orders.curOrder

  useEffect(() => {
    if (id) dispatch(fetchOrder(id))
  }, [])

  return (
    <>
      <Head>
        <title>Storefly dashboard - Order</title>
      </Head>
      <div className="container">
        <h1>Order</h1>
        {orders.loading && <Loader type={SPINNER_TYPE} size="small" />}
        {!orders.loading && orders.curOrder ? (
          <ViewOrder {...curOrder} />
        ) : null}
      </div>
    </>
  )
}

Order.getLayout = adminLayout

export default Order

const ViewOrder = (order) => {
  const dispatch = useDispatch()
  const { id, dateOrder, items, customer, total, subtotal, shippingStatus } =
    order
  const addr = order.shippingAddress
  const date = format(new Date(dateOrder), 'MM/dd/yyyy')
  const hours = format(dateOrder, `hh:mm aaa`)

  const [shippingCss, shippingText] = getShipping(order.shippingStatus)
  const [paymentCss, paymentText] = getPayment(order.paymentStatus)

  const handleMarkAsShipped = (e) => {
    dispatch(
      markShippingStatus({ orderId: order.id, status: SHIPPING_SHIPPED }),
    )
  }

  return (
    <>
      <h3>
        #{id}{' '}
        <span className="order-date">
          {date} at {hours}
        </span>
      </h3>
      <div className="order-content">
        <div className="left">
          <h4 className="heading-order-status">
            <Octagon
              width={44}
              height={44}
              className={`order-status-icon ${shippingCss}`}
            />
            <span className="order-status-text">{shippingText}</span>
          </h4>
          <table className="table-basic-auto">
            <thead></thead>
            <tbody>
              {items?.map((item) => (
                <ViewOrderItem key={item.id} {...item} />
              ))}
            </tbody>
          </table>
          <div className="btn-container">
            <button
              disabled={shippingStatus === SHIPPING_SHIPPED}
              className="btn btn-secondary btn-shipped"
              onClick={handleMarkAsShipped}
            >
              Mark as shipped
            </button>
          </div>
        </div>
        <div className="right">
          <h4>Customer</h4>
          <p>
            <strong>Name: </strong>
            {`${customer?.firstName} ${customer?.lastName}`}
            <br />
            <strong>E-mail: </strong>
            {`${customer?.email}`}
          </p>
          <h4>Shipping address</h4>
          <p>
            Address line 1: {addr?.addressLine1}
            {addr?.addressLine2 ? (
              <>
                <br />
                Address line 2: {addr?.addressLine1}
              </>
            ) : null}
            <br />
            City: {addr?.city}
            <br />
            State: {addr?.state}
            <br />
            Country: {addr?.country}
            <br />
            Postal code: {addr?.postalCode}
          </p>
        </div>
      </div>
      <div className="total">
        <h4 className="heading-order-status">
          <Circle
            width={44}
            height={44}
            className={`order-status-icon ${paymentCss}`}
          />
          <span className="order-status-text">{paymentText}</span>
        </h4>
        <table className="table">
          <tbody>
            <tr>
              <td className="col-total">Subtotal</td>
              <td>{subtotal?.toFixed(2)}</td>
            </tr>
            <tr>
              <td>Total</td>
              <td>{total?.toFixed(2)}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  )
}

const ViewOrderItem = ({ title, image, price, quantity, total }) => {
  const baseUrl = `http://localhost:2222`
  return (
    <>
      <tr>
        <td className="order-item-cover">
          <div className="cover-container">
            <img src={`${baseUrl}/${image}`} />
            <div className="order-quantity">{quantity}</div>
          </div>
        </td>
        <td>{title}</td>
        <td>
          {price.toFixed(2)} x {quantity}{' '}
        </td>
        <td>{total.toFixed(2)}</td>
      </tr>
    </>
  )
}

const getShipping = (shippingName) => {
  switch (shippingName) {
    case SHIPPING_SHIPPED:
      return ['shipping-shipped-icon', 'Shipped']
    case SHIPPING_UNSHIPPED:
      return ['shipping-unshipped-icon', 'Not shipped']
    case SHIPPING_DELIVERED:
      return ['shipping-delivered-icon', 'Delivered']
    default:
      return []
  }
}

const getPayment = (paymentName) => {
  switch (paymentName) {
    case PAYMENT_PAID:
      return ['payment-paid-icon', 'Paid']
    case PAYMENT_UNPAID:
      return ['payment-unpaid-icon', 'Pending']
    default:
      return []
  }
}

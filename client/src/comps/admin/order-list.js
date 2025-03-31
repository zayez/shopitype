import { useRouter } from 'next/router'
import { format } from 'date-fns'
import { upperCaseFirst } from 'upper-case-first'
const capitalize = upperCaseFirst

const OrderItem = ({ order }) => {
  const router = useRouter()
  const date = format(order.dateOrder, 'MM/dd/yyyy')
  const itemsAmount = order.items.reduce((acc, cur) => {
    return acc + cur.quantity
  }, 0)

  const handleItemClick = (e) => {
    e.preventDefault()
    router.push(`/admin/orders/${order.id}`)
  }

  return (
    <tr onClick={handleItemClick}>
      <td>{order.id}</td>
      <td>{date.toString()}</td>
      <td>{`${order.customer?.firstName} ${order.customer?.lastName}`}</td>
      <td>{order.total.toFixed(2)}</td>
      <td>{capitalize(order.paymentStatus)}</td>
      <td>{capitalize(order.shippingStatus)}</td>
      <td>{itemsAmount}</td>
    </tr>
  )
}

const OrderList = ({ orders }) => {
  return (
    <div className="order-list">
      <table className="table-basic">
        <thead>
          <tr>
            <th>#</th>
            <th>Date</th>
            <th>Customer</th>
            <th>Total</th>
            <th>Payment</th>
            <th>Shipping</th>
            <th>Items</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <OrderItem order={order} key={order.id} />
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default OrderList

import Link from 'next/link'
import { Plus as IPlus, Minus as IMinus } from 'react-feather'
import { useCartStore } from '../../stores/cart-store'
import { useShallow } from 'zustand/shallow'

const baseUrl = `http://localhost:2222`

let dollarUS = Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
})

const CartList = ({ items }) => {
  return (
    <>
      <table className="table-basic cart-table">
        <thead>
          <tr>
            <th className="col-center">#</th>
            <th className="cart-item-name" colSpan={2}>
              Product
            </th>
            <th>Price</th>
            <th className="col-quantity">Quantity</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <CartItem
                key={item.id}
                id={item.id}
                title={item.title}
                price={item.price}
                quantity={item.quantity}
                image={item.image}
              />
            </tr>
          ))}
        </tbody>
      </table>
    </>
  )
}

const CartItem = ({ id, title, image, price, quantity }) => {
  const { increaseItem, decreaseItem, removeItem } = useCartStore(
    useShallow((state) => ({
      increaseItem: state.increaseItem,
      decreaseItem: state.decreaseItem,
      removeItem: state.removeItem,
    })),
  )

  const handleIncreaseItem = (e) => {
    increaseItem(id)
  }

  const handleDecreaseItem = (e) => {
    decreaseItem(id)
  }

  const handleRemoveItem = (e) => {
    removeItem(id)
  }

  const total = price * quantity
  return (
    <>
      <td className="col-center">{id}</td>
      <td colSpan={1} className="item-cover">
        <Link href={`/products/${id}`}>
          <a>
            <img src={`${baseUrl}/${image}`} />
          </a>
        </Link>
      </td>
      <td>
        <div className="item-title">{title}</div>
      </td>
      <td>
        <div className="item-price">{dollarUS.format(price)}</div>
      </td>
      <td>
        <div className="quantity-wrapper">
          <div className="item-quantity">
            <button className="btn-icon" onClick={handleDecreaseItem}>
              <IMinus />
            </button>
            <div className="quantity-text">
              <input
                id="txtQuantity"
                type="text"
                value={quantity}
                disabled={true}
              />
            </div>
            <button className="btn-icon" onClick={handleIncreaseItem}>
              <IPlus />
            </button>
          </div>
          <div className="item-remove">
            <button className="btn" onClick={handleRemoveItem}>
              Remove
            </button>
          </div>
        </div>
      </td>
      <td>
        <div className="item-total">{dollarUS.format(total)}</div>
      </td>
    </>
  )
}

export default CartList

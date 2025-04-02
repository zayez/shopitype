import { useEffect } from 'react'
import { useCartStore } from '../stores/cart-store'
import { useShallow } from 'zustand/shallow'

const Success = () => {
  const { clearCart } = useCartStore(
    useShallow((state) => ({ clearCart: state.clearCart })),
  )

  useEffect(() => {
    clearCart()
  }, [])

  return (
    <div>
      <h1>Success</h1>
      <p>Order successfully placed. Wait for delivery.</p>
    </div>
  )
}

export default Success

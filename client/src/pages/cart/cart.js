import { useEffect } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import CartList from '../../comps/cart-list/cart-list.js'

import { ArrowLeft as IArrowLeft } from 'react-feather'
import { useShallow } from 'zustand/shallow'
import { useCartStore } from '../../stores/cart-store.js'
import { useAuthStore } from '../../stores/auth-store.js'

let dollarUS = Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
})

const Cart = () => {
  const { items, loading } = useCartStore(
    useShallow((state) => ({ items: state.items })),
  )

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <>
      <Head>
        <title>Shopitype | Cart </title>
      </Head>
      <div>
        <h1>Shopping Cart</h1>
        {items.length ? (
          <>
            <CartList items={items} />
            <CartFooter />
          </>
        ) : (
          <div>
            <p>Your cart is currently empty.</p>
            <h2>
              <IArrowLeft />
              <a href="/">Start shopping</a>
            </h2>
          </div>
        )}
      </div>
    </>
  )
}

const CartFooter = () => {
  const router = useRouter()
  const { user } = useAuthStore(
    useShallow((state) => ({
      user: state.user,
    })),
  )
  const {
    items,
    subtotal,
    isCheckoutComplete,
    calculateSubtotal,
    createStripeCheckout,
    clearCart,
    resetCheckout,
  } = useCartStore(
    useShallow((state) => ({
      items: state.items,
      subtotal: state.subtotal,
      isCheckoutComplete: state.isCheckoutComplete,
      calculateSubtotal: state.calculateSubtotal,
      clearCart: state.clearCart,
      resetCheckout: state.resetCheckout,
    })),
  )
  const userId = user?.id ?? null

  const handleContinueShopping = (e) => {
    e.preventDefault()
    router.push('/')
  }

  const handleClearCart = (e) => {
    clearCart()
  }

  const handleCheckout = () => {
    if (!user) {
      router.push('signin')
    }

    const _items = items.map((i) => {
      return {
        id: i.id,
        quantity: i.quantity,
      }
    })
    createStripeCheckout({ items: _items, userId })
  }

  useEffect(() => {
    calculateSubtotal()
  }, [items])

  useEffect(() => {
    resetCheckout()
  }, [resetCheckout])

  useEffect(() => {
    if (isCheckoutComplete) {
      const url = targetUrl
      window.location = url
    }
  }, [isCheckoutComplete])

  return (
    <>
      <div className="cart-footer">
        <div className="cart-footer-clear">
          <button className="btn btn-secondary" onClick={handleClearCart}>
            Clear cart
          </button>
        </div>
        <div className="cart-footer-checkout">
          <h3 className="cart-subtotal">
            Subtotal: {dollarUS.format(subtotal)}
          </h3>
          <p>Taxes and shipping calculated at checkout</p>
          <div className="shop-group">
            <button className="btn btn-primary" onClick={handleCheckout}>
              Checkout
            </button>
            <button className="btn" onClick={handleContinueShopping}>
              Continue shopping
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default Cart

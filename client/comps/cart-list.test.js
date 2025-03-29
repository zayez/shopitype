import { screen, render } from '@testing-library/react'
import CartList from './CartList'
import { store } from '../store'
import { Provider } from 'react-redux'

let dollarUS = Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
})

it('should diplay all items', () => {
  const items = [
    {
      id: 1,
      title: 'Book one',
      price: 25,
      quantity: 1,
      image: 'image1.jpg',
    },
    {
      id: 2,
      title: 'Book two',
      price: 45,
      quantity: 3,
      image: 'image2.jpg',
    },
  ]
  render(
    <>
      <Provider store={store()}>
        <CartList items={items} />
      </Provider>
    </>,
  )

  for (const item of items) {
    expect(
      screen.getByRole('cell', { name: new RegExp(item.title, 'i') }),
    ).toBeInTheDocument()

    const itemsEl = screen.queryAllByText(
      dollarUS.format(item.price * item.quantity),
    )
    expect(itemsEl.length).toBeGreaterThan(0)
  }
})

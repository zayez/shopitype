import { render, screen, within } from '@testing-library/react'
import { createServer } from '../../test/msw-server'
import ProductsView from './products-view'
import { store } from '../../store'
import { Provider } from 'react-redux'
import products from '../../test/fixtures/products.json' with { type: 'json' }

let dollarUS = Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
})


createServer([
  {
    path: '/api/products',
    res: () => {
      return products
    },
  },
])

test('should render two links, and an image and the price for each product', async () => {
  render(
    <Provider store={store()}>
      <ProductsView />
    </Provider>,
  )

  for (const product of products) {
    const links = await screen.findAllByRole('link', { name: product.title })
    expect(links).toHaveLength(2)
    expect(links[1]).toHaveTextContent(product.title)
    expect(links[0]).toHaveAttribute('href', `/products/${product.id}`)
    expect(links[1]).toHaveAttribute('href', `/products/${product.id}`)

    const image = within(links[0]).getByRole('img')
    expect(image).toBeInTheDocument()
    expect(image).toHaveAttribute('src', expect.stringContaining(product.image))

    expect(screen.getByText(dollarUS.format(product.price))).toBeInTheDocument()
  }
})

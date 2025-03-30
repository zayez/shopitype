import { render, screen } from '@testing-library/react'
import ProductView from './product-view'
import { createAppStore, store } from '../../store'
import { createServer } from '../../test/msw-server'
import { Provider } from 'react-redux'
import products from '../../test/fixtures/products.json' with { type: 'json' }

const product = products[2]

let dollarUS = Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
})

describe('renders a product', () => {
  const {store} = createAppStore()
  createServer([
    {
      path: `/api/products/:productId`,
      res: () => {
        return product
      },
    },
  ])
  test('should render a title, image and a price', async () => {
    render(
      <Provider store={store}>
        <ProductView id={product.id} />
      </Provider>,
    )

    const heading = await screen.findByRole('heading', { name: product.title })
    const image = screen.getByRole('img')
    const price = screen.getByText(dollarUS.format(product.price))

    expect(heading).toBeInTheDocument()
    expect(heading).toHaveTextContent(product.title)
    expect(image).toBeInTheDocument()
    expect(image).toHaveAttribute('src', expect.stringContaining(product.image))
    expect(price).toBeInTheDocument()

  })
})

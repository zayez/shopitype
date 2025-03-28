import { render, screen, within } from '@testing-library/react'
import { createServer } from '../test/msw-server'
import ProductsView from './ProductsView'
import { store } from '../store'
import { Provider } from 'react-redux'

let dollarUS = Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
})

const products = [
  {
    id: 1,
    title: 'Demons Souls',
    image:
      'uploads/2025-03-27-11-57-30_demons-souls-packshot-standard-edition-straight-ps5-es-12nov20.jpg',
    price: 39.9,
    inventory: 25,
    statusId: 2,
    categoryId: 1,
    createdAt: '2025-03-27 23:57:30',
    updatedAt: '2025-03-27 23:57:30',
  },
  {
    id: 2,
    title: 'Ghost of Tsushima',
    image: 'uploads/2025-03-27-11-57-50_image_1__84121_zoom.jpg',
    price: 25,
    inventory: 12,
    statusId: 2,
    categoryId: 1,
    createdAt: '2025-03-27 23:57:50',
    updatedAt: '2025-03-27 23:57:50',
  },
]

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
    <Provider store={store}>
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

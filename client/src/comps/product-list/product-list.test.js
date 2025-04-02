import { render, screen, within } from '@testing-library/react'
import products from '../../test/fixtures/products.json'
import ProductList from './product-list'

let dollarUS = Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
})

describe('ProductList component', () => {
  test('should display a list of products', () => {
    render(<ProductList products={products} />)

    for (const product of products) {
      const links = screen.getAllByRole('link', { name: product.title })
      expect(links).toHaveLength(2)
      expect(links[1]).toHaveTextContent(product.title)
      expect(links[0]).toHaveAttribute('href', `/products/${product.id}`)
      expect(links[1]).toHaveAttribute('href', `/products/${product.id}`)
      const image = within(links[0]).getByRole('img')
      expect(image).toBeInTheDocument()
      expect(image).toHaveAttribute(
        'src',
        expect.stringContaining(product.image),
      )

      expect(
        screen.getByText(dollarUS.format(product.price)),
      ).toBeInTheDocument()
    }
  })
})

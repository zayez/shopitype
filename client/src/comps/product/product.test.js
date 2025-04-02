import { render, screen } from '@testing-library/react'
import Product from './product'

let dollarUS = Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
})

describe('Product component', () => {
  test('should display product information', () => {
    const product = {
      title: 'Resident Evil',
      image: 'uploads/resident-evil-cover.jpg',
      price: 30.99,
      description: 'A new resident evil title',
    }
    render(<Product product={product} />)

    const image = screen.getByRole('img')
    const title = screen.getByRole('heading', {
      name: new RegExp(product.title),
    })
    const price = screen.getByText(dollarUS.format(product.price))
    const description = screen.getByText(product.description)

    expect(image).toBeInTheDocument()
    expect(image).toHaveAttribute('src', expect.stringContaining(product.image))
    expect(title).toBeInTheDocument()
    expect(title).toHaveTextContent(product.title)
    expect(price).toBeInTheDocument()
    expect(description).toBeInTheDocument()
  })
})

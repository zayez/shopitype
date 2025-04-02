import { render } from '@testing-library/react'
import Spinner from './spinner'

describe('Spinner component', () => {
  it('renders with the default medium size', () => {
    const { container } = render(<Spinner />)
    const spinnerElement = container.querySelector('.spinner')
    expect(spinnerElement).toHaveClass('spinner-md')
  })

  it('renders with the small size when passed size="small"', () => {
    const { container } = render(<Spinner size="small" />)
    const spinnerElement = container.querySelector('.spinner')
    expect(spinnerElement).toHaveClass('spinner-sm')
  })

  it('renders with the large size when passed size="large"', () => {
    const { container } = render(<Spinner size="large" />)
    const spinnerElement = container.querySelector('.spinner')
    expect(spinnerElement).toHaveClass('spinner-lg')
  })
})
